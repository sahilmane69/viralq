import { currentUser } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { analyzeVideoWithOpenAI, type AnalyzeVideoInput } from "@/lib/openai/service";
import {
  getAnalysis,
  saveOpenAIReport,
  updateAnalysis,
} from "@/lib/supabase/database";

type CreateReportRequest = {
  extractedFrames?: AnalyzeVideoInput["extractedFrames"];
  platform?: string;
  audience?: string;
  goal?: string;
  caption?: string;
};

class InvalidReportRequestError extends Error {}

function getRequiredString(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new InvalidReportRequestError(`Missing required field: ${field}.`);
  }

  return value.trim();
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ analysisId: string }> },
) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { analysisId } = await params;
  const body = (await req.json()) as CreateReportRequest;
  const extractedFrames = body.extractedFrames;

  if (!Array.isArray(extractedFrames) || extractedFrames.length === 0) {
    return Response.json({ error: "Missing required field: extractedFrames." }, { status: 400 });
  }

  let input: AnalyzeVideoInput;

  try {
    input = {
      extractedFrames,
      platform: getRequiredString(body.platform, "platform"),
      audience: getRequiredString(body.audience, "audience"),
      goal: getRequiredString(body.goal, "goal"),
      caption: getRequiredString(body.caption, "caption"),
    };
  } catch (error) {
    if (error instanceof InvalidReportRequestError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    throw error;
  }

  try {
    const analysis = await getAnalysis(user.id, analysisId);

    if (!analysis) {
      return Response.json({ error: "Analysis not found." }, { status: 404 });
    }

    await updateAnalysis(user.id, analysisId, { status: "processing" });

    const aiReport = await analyzeVideoWithOpenAI(input);

    const report = await saveOpenAIReport(user.id, {
      analysisId,
      report: aiReport,
    });

    const updatedAnalysis = await updateAnalysis(user.id, analysisId, {
      status: "completed",
      score: Math.round(aiReport.overallScore),
    });

    return Response.json({
      analysis: updatedAnalysis,
      report,
      aiReport,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI analysis failed.";

    await updateAnalysis(user.id, analysisId, {
      status: "failed",
    }).catch((updateError) => {
      console.error("Failed to mark analysis as failed", updateError);
    });

    console.error("AI report generation failed", error);

    return Response.json({ error: message }, { status: 500 });
  }
}
