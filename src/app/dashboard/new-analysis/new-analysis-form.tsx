"use client";

import {
  Button,
  Card,
  CardBody,
  Form,
  Input,
  Link,
  Progress,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useRef, useState, type DragEvent, type FormEvent } from "react";

const platforms = ["TikTok", "Instagram Reels", "YouTube Shorts", "LinkedIn", "X"];
const audiences = ["Gen Z", "Millennials", "Founders", "Creators", "B2B buyers"];
const niches = ["SaaS", "Fitness", "Beauty", "Education", "Finance", "Lifestyle"];
const goals = ["Improve hook", "Increase retention", "Boost shares", "Drive conversions"];

type UploadStatus = "idle" | "uploading" | "success" | "error";

type UploadedVideo = {
  analysisId: string;
  title: string;
  videoUrl: string;
};

export function NewAnalysisForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<UploadedVideo | null>(null);

  const setFirstVideoFile = (files: FileList | null) => {
    const file = files?.[0];

    if (file) {
      setSelectedFile(file);
      setUploadError(null);
      setUploadedVideo(null);
      setUploadStatus("idle");
      setUploadProgress(0);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    setFirstVideoFile(event.dataTransfer.files);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      setUploadStatus("error");
      setUploadError("Choose a video before starting an analysis.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("video", selectedFile);

    const titleParts = ["platform", "goal"]
      .map((name) => formData.get(name))
      .filter((value): value is string => typeof value === "string" && value.trim().length > 0);
    formData.set("title", titleParts.length ? titleParts.join(" - ") : selectedFile.name);

    setUploadStatus("uploading");
    setUploadError(null);
    setUploadedVideo(null);
    setUploadProgress(0);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (progressEvent) => {
      if (progressEvent.lengthComputable) {
        setUploadProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
      }
    };

    xhr.onerror = () => {
      setUploadStatus("error");
      setUploadError("Network error while uploading. Please try again.");
    };

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText) as {
          analysis?: { id: string; title: string };
          videoUrl?: string;
          error?: string;
        };

        if (xhr.status >= 400 || response.error || !response.analysis || !response.videoUrl) {
          throw new Error(response.error ?? "Video upload failed.");
        }

        setUploadProgress(100);
        setUploadStatus("success");
        setUploadedVideo({
          analysisId: response.analysis.id,
          title: response.analysis.title,
          videoUrl: response.videoUrl,
        });
      } catch (error) {
        setUploadStatus("error");
        setUploadError(error instanceof Error ? error.message : "Video upload failed.");
      }
    };

    xhr.open("POST", "/api/videos/upload");
    xhr.send(formData);
  };

  return (
    <Form className="grid gap-6" validationBehavior="native" onSubmit={handleSubmit}>
      <Card className="border border-slate-200 shadow-none">
        <CardBody className="p-5 sm:p-6">
          <Input
            ref={fileInputRef}
            accept="video/mp4,video/quicktime,video/webm"
            aria-label="Video upload"
            className="hidden"
            name="video"
            type="file"
            onChange={(event) => setFirstVideoFile(event.target.files)}
          />

          <div
            className={`flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
            }`}
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <div className="grid size-14 place-items-center rounded-2xl bg-blue-100 text-blue-700">
              <svg
                aria-hidden="true"
                className="size-7"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M12 16V4m0 0 4 4m-4-4-4 4" />
                <path d="M20 16.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.5" />
              </svg>
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-950">
              Drag and drop your video
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Upload an MP4, MOV, or WebM file. Choose a short-form video that represents the
              content you want ViralIQ to analyze.
            </p>
            <Button className="mt-6 bg-blue-600 font-semibold text-white" radius="lg">
              Choose video
            </Button>
            {selectedFile ? (
              <p className="mt-4 text-sm font-medium text-blue-700">{selectedFile.name}</p>
            ) : null}
            {uploadStatus === "uploading" ? (
              <div className="mt-6 w-full max-w-md">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">Uploading video</span>
                  <span className="text-slate-500">{uploadProgress}%</span>
                </div>
                <Progress
                  aria-label="Video upload progress"
                  color="primary"
                  size="sm"
                  value={uploadProgress}
                />
              </div>
            ) : null}
            {uploadError ? (
              <div className="mt-6 w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {uploadError}
              </div>
            ) : null}
            {uploadedVideo ? (
              <div className="mt-6 w-full max-w-md rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                <p className="font-semibold">Upload complete</p>
                <Link
                  className="mt-1 block truncate text-sm text-emerald-700"
                  href={uploadedVideo.videoUrl}
                  target="_blank"
                >
                  {uploadedVideo.videoUrl}
                </Link>
              </div>
            ) : null}
          </div>
        </CardBody>
      </Card>

      <Card className="border border-slate-200 shadow-none">
        <CardBody className="grid gap-5 p-5 sm:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Select isRequired label="Platform" name="platform" placeholder="Select platform">
              {platforms.map((platform) => (
                <SelectItem key={platform}>{platform}</SelectItem>
              ))}
            </Select>
            <Select isRequired label="Audience" name="audience" placeholder="Select audience">
              {audiences.map((audience) => (
                <SelectItem key={audience}>{audience}</SelectItem>
              ))}
            </Select>
            <Select isRequired label="Niche" name="niche" placeholder="Select niche">
              {niches.map((niche) => (
                <SelectItem key={niche}>{niche}</SelectItem>
              ))}
            </Select>
            <Select isRequired label="Goal" name="goal" placeholder="Select goal">
              {goals.map((goal) => (
                <SelectItem key={goal}>{goal}</SelectItem>
              ))}
            </Select>
          </div>

          <Textarea
            label="Caption"
            minRows={5}
            name="caption"
            placeholder="Paste the draft caption, hook, or creative notes for this video."
          />

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button className="font-semibold text-slate-700" radius="lg" variant="light">
              Save draft
            </Button>
            <Button
              className="bg-blue-600 font-semibold text-white"
              isDisabled={uploadStatus === "uploading"}
              isLoading={uploadStatus === "uploading"}
              radius="lg"
              type="submit"
            >
              {uploadStatus === "uploading" ? "Uploading..." : "Start analysis"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </Form>
  );
}
