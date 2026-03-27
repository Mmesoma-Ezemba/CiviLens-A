import { supabase } from './supabaseClient';
import type { AnalysisResult, AnalysisHistoryItem } from './types';

/**
 * Save a completed analysis to Supabase.
 */
export async function saveAnalysis(
  userId: string,
  inputText: string,
  result: AnalysisResult
): Promise<string> {
  const { data, error } = await supabase
    .from('analyses')
    .insert({
      user_id: userId,
      input_preview: inputText.slice(0, 200),
      result: result,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

/**
 * Fetch analysis history for a user, ordered by most recent first.
 */
export async function getAnalysisHistory(
  userId: string,
  maxItems = 20
): Promise<AnalysisHistoryItem[]> {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(maxItems);

  if (error) throw error;

  return data.map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    inputPreview: row.input_preview,
    result: row.result as AnalysisResult,
    createdAt: new Date(row.created_at),
  }));
}

/**
 * Fetch a single analysis by ID.
 */
export async function getAnalysisById(
  userId: string,
  analysisId: string
): Promise<AnalysisHistoryItem | null> {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', analysisId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  if (!data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    inputPreview: data.input_preview,
    result: data.result as AnalysisResult,
    createdAt: new Date(data.created_at),
  };
}
