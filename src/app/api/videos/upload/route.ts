import { currentUser } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { createAnalysis, upsertProfileFromClerk } from "@/lib/supabase/database";
import { createVideoStoragePath, uploadVideoToStorage } from "@/lib/supabase/storage";

const MAX_VIDEO_SIZE = 500 * 1024 * 1024;

function getPrimaryEmail(user: Awaited<ReturnType<typeof currentUser>>) {
  return user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses[0]?.emailAddress ?? null;
}

function getFullName(user: Awaited<ReturnType<typeof currentUser>>) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || null;
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("video");
    const title = formData.get("title");

    if (!(file instanceof File)) {
      return Response.json({ error: "Missing video file" }, { status: 400 });
    }

    if (file.size > MAX_VIDEO_SIZE) {
      return Response.json({ error: "Video must be 500MB or smaller" }, { status: 400 });
    }

    await upsertProfileFromClerk({
      clerkUserId: user.id,
      email: getPrimaryEmail(user),
      name: getFullName(user),
      avatarUrl: user.imageUrl ?? null,
    });

    const storagePath = createVideoStoragePath(user.id, file);
    const uploadedVideo = await uploadVideoToStorage(file, storagePath);
    const analysis = await createAnalysis(user.id, {
      title: typeof title === "string" && title.trim() ? title.trim() : file.name,
      video_url: uploadedVideo.publicUrl,
      status: "queued",
      metadata: {
        storage_path: uploadedVideo.path,
        original_filename: file.name,
        content_type: file.type,
        size_bytes: file.size,
      },
    });

    return Response.json({
      analysis,
      videoUrl: uploadedVideo.publicUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Video upload failed";
    console.error("Video upload failed", error);

    return Response.json({ error: message }, { status: 500 });
  }
}
