"use client";

import {
  Button,
  Card,
  CardBody,
  Form,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useRef, useState, type DragEvent } from "react";

const platforms = ["TikTok", "Instagram Reels", "YouTube Shorts", "LinkedIn", "X"];
const audiences = ["Gen Z", "Millennials", "Founders", "Creators", "B2B buyers"];
const niches = ["SaaS", "Fitness", "Beauty", "Education", "Finance", "Lifestyle"];
const goals = ["Improve hook", "Increase retention", "Boost shares", "Drive conversions"];

export function NewAnalysisForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const setFirstVideoFile = (files: FileList | null) => {
    const file = files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    setFirstVideoFile(event.dataTransfer.files);
  };

  return (
    <Form className="grid gap-6" validationBehavior="native">
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
            <Button className="bg-blue-600 font-semibold text-white" radius="lg" type="submit">
              Start analysis
            </Button>
          </div>
        </CardBody>
      </Card>
    </Form>
  );
}
