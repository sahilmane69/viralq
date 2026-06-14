import { randomUUID } from "node:crypto";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);
const FRAME_INTERVAL_SECONDS = 3;
const MAX_VIDEO_SIZE_BYTES = 250 * 1024 * 1024;

function getFileExtension(file: File) {
  const extension = path.extname(file.name).toLowerCase();

  if (extension) {
    return extension;
  }

  if (file.type === "video/mp4") {
    return ".mp4";
  }

  if (file.type === "video/quicktime") {
    return ".mov";
  }

  if (file.type === "video/webm") {
    return ".webm";
  }

  return ".video";
}

async function extractFrames(inputPath: string, outputPattern: string) {
  await execFileAsync("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-i",
    inputPath,
    "-vf",
    `fps=1/${FRAME_INTERVAL_SECONDS}`,
    "-q:v",
    "2",
    outputPattern,
  ]);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const video = formData.get("video");

  if (!(video instanceof File)) {
    return Response.json({ error: "Upload a video file using the 'video' field." }, { status: 400 });
  }

  if (!video.type.startsWith("video/")) {
    return Response.json({ error: "Uploaded file must be a video." }, { status: 400 });
  }

  if (video.size > MAX_VIDEO_SIZE_BYTES) {
    return Response.json({ error: "Video must be 250MB or smaller." }, { status: 413 });
  }

  const jobId = randomUUID();
  const workspacePath = path.join(tmpdir(), "viralq-frame-extraction", jobId);
  const publicOutputPath = path.join(process.cwd(), "public", "temp", "frames", jobId);
  const inputPath = path.join(workspacePath, `input${getFileExtension(video)}`);
  const outputPattern = path.join(publicOutputPath, "frame-%04d.jpg");

  try {
    await Promise.all([mkdir(workspacePath, { recursive: true }), mkdir(publicOutputPath, { recursive: true })]);

    const videoBuffer = Buffer.from(await video.arrayBuffer());
    await writeFile(inputPath, videoBuffer);

    await extractFrames(inputPath, outputPattern);

    const frames = (await readdir(publicOutputPath))
      .filter((fileName) => fileName.endsWith(".jpg"))
      .sort()
      .map((fileName) => `/temp/frames/${jobId}/${fileName}`);

    return Response.json({
      frameIntervalSeconds: FRAME_INTERVAL_SECONDS,
      frames,
    });
  } catch (error) {
    console.error("Frame extraction failed", error);

    await rm(publicOutputPath, { force: true, recursive: true });

    return Response.json(
      { error: "Frame extraction failed. Make sure ffmpeg is installed and the video is valid." },
      { status: 500 },
    );
  } finally {
    await rm(workspacePath, { force: true, recursive: true });
  }
}
