import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { upsertProfileFromClerk } from "@/lib/supabase/database";

function getPrimaryEmail(data: {
  email_addresses?: Array<{ id?: string; email_address?: string }>;
  primary_email_address_id?: string | null;
}) {
  const primaryEmail = data.email_addresses?.find(
    (email) => email.id === data.primary_email_address_id,
  );

  return primaryEmail?.email_address ?? data.email_addresses?.[0]?.email_address ?? null;
}

function getFullName(data: { first_name?: string | null; last_name?: string | null }) {
  return [data.first_name, data.last_name].filter(Boolean).join(" ").trim() || null;
}

export async function POST(req: NextRequest) {
  try {
    const event = await verifyWebhook(req);

    if (event.type !== "user.created") {
      return Response.json({ received: true, ignored: true });
    }

    const { data } = event;

    await upsertProfileFromClerk({
      clerkUserId: data.id,
      email: getPrimaryEmail(data),
      name: getFullName(data),
      avatarUrl: data.image_url ?? null,
    });

    return Response.json({ received: true });
  } catch (error) {
    console.error("Clerk webhook failed", error);
    return Response.json({ error: "Webhook verification or profile sync failed" }, { status: 400 });
  }
}
