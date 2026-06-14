import { createSupabaseAdminClient } from "./admin";
import type { VideoAnalysisScore } from "@/lib/openai/service";
import type { Json, Tables, TablesInsert, TablesUpdate } from "@/types/database";

export type Profile = Tables<"profiles">;
export type Analysis = Tables<"analyses">;
export type Report = Tables<"reports">;

export type UpsertProfileInput = TablesInsert<"profiles">;
export type CreateAnalysisInput = Omit<TablesInsert<"analyses">, "profile_id">;
export type UpdateAnalysisInput = TablesUpdate<"analyses">;
export type UpsertReportInput = Omit<TablesInsert<"reports">, "profile_id">;

export type SaveOpenAIReportInput = {
  analysisId: string;
  report: VideoAnalysisScore;
};

export type PaginatedAnalyses = {
  analyses: Analysis[];
  total: number;
};

function assertDatabaseResult<T>(data: T | null, error: { message: string } | null): T {
  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Supabase operation did not return data.");
  }

  return data;
}

export async function upsertProfile(input: UpsertProfileInput): Promise<Profile> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .upsert(input, { onConflict: "clerk_user_id" })
    .select()
    .single();

  return assertDatabaseResult(data, error);
}

export async function upsertProfileFromClerk(input: {
  clerkUserId: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
}): Promise<Profile> {
  return upsertProfile({
    id: input.clerkUserId,
    clerk_user_id: input.clerkUserId,
    email: input.email,
    full_name: input.name,
    avatar_url: input.avatarUrl,
  });
}

export async function getProfile(profileId: string): Promise<Profile | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", profileId).maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createAnalysis(
  profileId: string,
  input: CreateAnalysisInput,
): Promise<Analysis> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("analyses")
    .insert({ ...input, profile_id: profileId })
    .select()
    .single();

  return assertDatabaseResult(data, error);
}

export async function getAnalysis(profileId: string, analysisId: string): Promise<Analysis | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", analysisId)
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function listAnalyses(profileId: string, limit = 20): Promise<Analysis[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function listAnalysesPage(
  profileId: string,
  page: number,
  pageSize = 10,
): Promise<PaginatedAnalyses> {
  const supabase = createSupabaseAdminClient();
  const currentPage = Math.max(page, 1);
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await supabase
    .from("analyses")
    .select("*", { count: "exact" })
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    analyses: data,
    total: count ?? 0,
  };
}

export async function updateAnalysis(
  profileId: string,
  analysisId: string,
  input: UpdateAnalysisInput,
): Promise<Analysis> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("analyses")
    .update(input)
    .eq("id", analysisId)
    .eq("profile_id", profileId)
    .select()
    .single();

  return assertDatabaseResult(data, error);
}

export async function upsertReport(profileId: string, input: UpsertReportInput): Promise<Report> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("reports")
    .upsert({ ...input, profile_id: profileId }, { onConflict: "analysis_id" })
    .select()
    .single();

  return assertDatabaseResult(data, error);
}

export async function saveOpenAIReport(
  profileId: string,
  input: SaveOpenAIReportInput,
): Promise<Report> {
  const reportJson = input.report as unknown as Json;

  return upsertReport(profileId, {
    analysis_id: input.analysisId,
    summary: [
      input.report.strengths[0] ? `Strength: ${input.report.strengths[0]}` : null,
      input.report.weaknesses[0] ? `Weakness: ${input.report.weaknesses[0]}` : null,
    ]
      .filter(Boolean)
      .join(" "),
    hook_score: Math.round(input.report.hookScore),
    pacing_score: Math.round(input.report.retentionScore),
    clarity_score: Math.round(input.report.contentQualityScore),
    share_score: Math.round(input.report.engagementScore),
    recommendations: input.report.recommendations as unknown as Json,
    raw_report: reportJson,
  });
}

export async function getReportByAnalysis(
  profileId: string,
  analysisId: string,
): Promise<Report | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("analysis_id", analysisId)
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function listReports(profileId: string, limit = 20): Promise<Report[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export function createEmptyReportPayload(): Json {
  return {
    recommendations: [],
    signals: {},
  };
}
