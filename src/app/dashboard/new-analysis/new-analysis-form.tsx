"use client";

import {
  Button,
  Card,
  CardBody,
  Form,
  Link,
  Progress,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { ImprovementSection } from "@/components/improvement-section";
import { MetricCard, reportMetricLabels } from "@/components/metric-card";
import { RecommendationCard } from "@/components/recommendation-card";
import { ScoreCircle } from "@/components/score-circle";
import { StrengthsDetected } from "@/components/strengths-detected";
import type { VideoAnalysisScore } from "@/lib/openai/service";

const platforms = ["TikTok", "Instagram Reels", "YouTube Shorts", "LinkedIn", "X"];
const audiences = ["Gen Z", "Millennials", "Founders", "Creators", "B2B buyers"];
const niches = ["SaaS", "Fitness", "Beauty", "Education", "Finance", "Lifestyle"];
const goals = ["Improve hook", "Increase retention", "Boost shares", "Drive conversions"];

type UploadStatus = "idle" | "uploading" | "analyzing" | "success" | "error";

type UploadedVideo = {
  analysisId: string;
  title: string;
  videoUrl: string;
};

type UploadResponse = {
  analysis?: { id: string; title: string };
  videoUrl?: string;
  error?: string;
};

type ExtractFramesResponse = {
  frames?: string[];
  error?: string;
};

type ReportResponse = {
  aiReport?: VideoAnalysisScore;
  error?: string;
};

export function NewAnalysisForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<UploadedVideo | null>(null);
  const [analysisReport, setAnalysisReport] = useState<VideoAnalysisScore | null>(null);

  const setFirstVideoFile = (files: FileList | null) => {
    const file = files?.[0];

    if (file) {
      setSelectedFile(file);
      setUploadError(null);
      setUploadedVideo(null);
      setAnalysisReport(null);
      setUploadStatus("idle");
      setUploadProgress(0);
    }
  };

  const extractFrameContext = async (file: File, caption: string) => {
    const frameData = new FormData();
    frameData.set("video", file);

    try {
      const response = await fetch("/api/extract-frames", {
        method: "POST",
        body: frameData,
      });
      const data = (await response.json()) as ExtractFramesResponse;

      if (!response.ok || data.error || !data.frames?.length) {
        throw new Error(data.error ?? "Frame extraction failed.");
      }

      return data.frames.map((frame, index) => ({
        timestamp: `${index * 3}s`,
        imageUrl: frame,
        description: `Extracted frame ${index + 1} from the uploaded video.`,
      }));
    } catch (error) {
      console.warn("Frame extraction unavailable, continuing with video context.", error);

      return [
        {
          timestamp: "0s",
          description: caption
            ? `Analyze this uploaded short-form video using the caption context: ${caption}`
            : "Analyze this uploaded short-form video using the available metadata.",
        },
      ];
    }
  };

  const createReport = async ({
    analysisId,
    caption,
    file,
    formData,
  }: {
    analysisId: string;
    caption: string;
    file: File;
    formData: FormData;
  }) => {
    setUploadStatus("analyzing");

    const extractedFrames = await extractFrameContext(file, caption);
    const response = await fetch(`/api/analyses/${analysisId}/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        extractedFrames,
        platform: formData.get("platform"),
        audience: formData.get("audience"),
        goal: formData.get("goal"),
        caption,
      }),
    });
    const reportResponse = (await response.json()) as ReportResponse;

    if (!response.ok || reportResponse.error || !reportResponse.aiReport) {
      throw new Error(reportResponse.error ?? "AI report generation failed.");
    }

    setAnalysisReport(reportResponse.aiReport);
    setUploadStatus("success");
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
    setAnalysisReport(null);
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

    xhr.onload = async () => {
      try {
        const response = JSON.parse(xhr.responseText) as UploadResponse;

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
        await createReport({
          analysisId: response.analysis.id,
          caption: String(formData.get("caption") ?? ""),
          file: selectedFile,
          formData,
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
          <input
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
            <Button
              className="mt-6 bg-blue-600 font-semibold text-white"
              radius="lg"
              type="button"
              onPress={() => fileInputRef.current?.click()}
            >
              Choose video
            </Button>
            {selectedFile ? (
              <p className="mt-4 text-sm font-medium text-blue-700">{selectedFile.name}</p>
            ) : null}
            {uploadStatus === "uploading" || uploadStatus === "analyzing" ? (
              <div className="mt-6 w-full max-w-md">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">
                    {uploadStatus === "uploading" ? "Uploading video" : "Generating report"}
                  </span>
                  <span className="text-slate-500">
                    {uploadStatus === "uploading" ? `${uploadProgress}%` : "AI analysis"}
                  </span>
                </div>
                <Progress
                  aria-label={
                    uploadStatus === "uploading"
                      ? "Video upload progress"
                      : "AI analysis progress"
                  }
                  color="primary"
                  isIndeterminate={uploadStatus === "analyzing"}
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
            <Button
              className="font-semibold text-slate-700"
              radius="lg"
              type="button"
              variant="light"
            >
              Save draft
            </Button>
            <Button
              className="bg-blue-600 font-semibold text-white"
              isDisabled={uploadStatus === "uploading" || uploadStatus === "analyzing"}
              isLoading={uploadStatus === "uploading" || uploadStatus === "analyzing"}
              radius="lg"
              type="submit"
            >
              {uploadStatus === "uploading"
                ? "Uploading..."
                : uploadStatus === "analyzing"
                  ? "Analyzing..."
                  : "Start analysis"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {analysisReport ? (
        <Card className="border border-slate-200 shadow-none">
          <CardBody className="grid gap-6 p-5 sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <ScoreCircle
                className="mx-auto shrink-0 lg:mx-0"
                score={analysisReport.overallScore}
              />
              <div>
                <p className="text-sm font-medium text-blue-600">Report ready</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                  Your AI analysis is complete
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  ViralIQ scored your video and saved the report to your analysis history.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label={reportMetricLabels.hookScore}
                score={analysisReport.hookScore}
              />
              <MetricCard
                label={reportMetricLabels.engagementScore}
                score={analysisReport.engagementScore}
              />
              <MetricCard
                label={reportMetricLabels.retentionScore}
                score={analysisReport.retentionScore}
              />
              <MetricCard
                label={reportMetricLabels.contentQualityScore}
                score={analysisReport.contentQualityScore}
              />
            </div>

            <ImprovementSection
              currentScore={analysisReport.overallScore}
              potentialScore={analysisReport.improvedScorePrediction}
            />

            <StrengthsDetected strengths={analysisReport.strengths} />

            {analysisReport.recommendations.length ? (
              <div>
                <h2 className="text-sm font-semibold text-slate-950">Recommendations</h2>
                <div className="mt-3 grid gap-3">
                  {analysisReport.recommendations.map((recommendation) => (
                    <RecommendationCard
                      expectedImpact={`Potential ${Math.round(
                        analysisReport.improvedScorePrediction,
                      )}/100`}
                      key={recommendation}
                      recommendation={recommendation}
                      whyItMatters="This recommendation targets a gap detected in the current video and can improve viewer response."
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </CardBody>
        </Card>
      ) : null}
    </Form>
  );
}
