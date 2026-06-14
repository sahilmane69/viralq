type ExtractedFrame = {
  timestamp?: number | string;
  description?: string;
  imageUrl?: string;
  text?: string;
};

export type AnalyzeVideoInput = {
  extractedFrames: Array<ExtractedFrame | string>;
  platform: string;
  audience: string;
  goal: string;
  caption: string;
};

export type VideoAnalysisScore = {
  overallScore: number;
  hookScore: number;
  engagementScore: number;
  retentionScore: number;
  contentQualityScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  missingElements: string[];
  improvedScorePrediction: number;
};

type ResponsesApiOutputText = {
  type?: string;
  text?: string;
};

type ResponsesApiOutputMessage = {
  content?: ResponsesApiOutputText[];
};

type ResponsesApiResponse = {
  output_text?: string;
  output?: ResponsesApiOutputMessage[];
};

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

const videoAnalysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overallScore: { type: "number" },
    hookScore: { type: "number" },
    engagementScore: { type: "number" },
    retentionScore: { type: "number" },
    contentQualityScore: { type: "number" },
    strengths: { type: "array", items: { type: "string" } },
    weaknesses: { type: "array", items: { type: "string" } },
    recommendations: { type: "array", items: { type: "string" } },
    missingElements: { type: "array", items: { type: "string" } },
    improvedScorePrediction: { type: "number" },
  },
  required: [
    "overallScore",
    "hookScore",
    "engagementScore",
    "retentionScore",
    "contentQualityScore",
    "strengths",
    "weaknesses",
    "recommendations",
    "missingElements",
    "improvedScorePrediction",
  ],
} as const;

function getOpenAIConfig() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  return {
    apiKey,
    model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
  };
}

function normalizeFrames(frames: AnalyzeVideoInput["extractedFrames"]) {
  return frames.map((frame, index) => {
    if (typeof frame === "string") {
      return {
        frame: index + 1,
        description: frame,
      };
    }

    return {
      frame: index + 1,
      timestamp: frame.timestamp ?? null,
      description: frame.description ?? frame.text ?? "",
      imageUrl: frame.imageUrl ?? null,
    };
  });
}

function extractResponseText(response: ResponsesApiResponse) {
  if (response.output_text) {
    return response.output_text;
  }

  return (
    response.output
      ?.flatMap((message) => message.content ?? [])
      .map((content) => content.text)
      .filter((text): text is string => Boolean(text))
      .join("\n") ?? ""
  );
}

function validateAnalysisScore(value: unknown): VideoAnalysisScore {
  if (!value || typeof value !== "object") {
    throw new Error("OpenAI response did not contain a valid analysis object.");
  }

  const analysis = value as VideoAnalysisScore;
  const scoreFields = [
    "overallScore",
    "hookScore",
    "engagementScore",
    "retentionScore",
    "contentQualityScore",
    "improvedScorePrediction",
  ] as const;
  const listFields = [
    "strengths",
    "weaknesses",
    "recommendations",
    "missingElements",
  ] as const;

  for (const field of scoreFields) {
    if (
      typeof analysis[field] !== "number" ||
      analysis[field] < 0 ||
      analysis[field] > 100
    ) {
      throw new Error(`OpenAI response has an invalid score field: ${field}.`);
    }
  }

  for (const field of listFields) {
    if (!Array.isArray(analysis[field])) {
      throw new Error(`OpenAI response is missing array field: ${field}.`);
    }
  }

  return analysis;
}

export async function analyzeVideoWithOpenAI(
  input: AnalyzeVideoInput,
): Promise<VideoAnalysisScore> {
  const { apiKey, model } = getOpenAIConfig();

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content:
            "You are ViralIQ, a senior short-form video strategist. Score content from 0 to 100 and return practical, specific feedback only in the requested JSON schema.",
        },
        {
          role: "user",
          content: JSON.stringify({
            platform: input.platform,
            audience: input.audience,
            goal: input.goal,
            caption: input.caption,
            extractedFrames: normalizeFrames(input.extractedFrames),
          }),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "video_analysis_score",
          strict: true,
          schema: videoAnalysisSchema,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as ResponsesApiResponse;
  const text = extractResponseText(data);

  if (!text) {
    throw new Error("OpenAI response did not include output text.");
  }

  return validateAnalysisScore(JSON.parse(text));
}
