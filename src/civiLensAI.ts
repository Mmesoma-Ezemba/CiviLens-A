/**
 * CiviLens AI — Core Analysis Engine
 *
 * This module contains the system prompt and the Gemini API integration
 * that powers the document analysis functionality.
 *
 * Reference: src/CIVILENS_PROMPT.md (source-of-truth)
 */

import { GoogleGenAI } from '@google/genai';
import type { AnalysisResult } from './types';

// ---------------------------------------------------------------------------
// System prompt (kept in sync with CIVILENS_PROMPT.md)
// ---------------------------------------------------------------------------

const CIVILENS_SYSTEM_PROMPT = `You are an AI assistant called CiviLens AI.

Your purpose is to help ordinary people understand complex real-world documents such as contracts, policies, agreements, and official notices.

You specialize in simplifying difficult language into clear, easy-to-understand explanations while preserving the original meaning.

🔷 TASK

Analyze the provided document and generate a structured response with the following sections:

Simple Explanation
Key Points (3–6 bullet points)
Risk Warnings
Practical Advice

🔷 OUTPUT FORMAT (STRICT)

You MUST follow this exact structure:

Simple Explanation:
[Write a clear and simple explanation of the document in plain language.]

Key Points:
• [Point 1]
• [Point 2]
• [Point 3]
• [Add up to 6 points total]

Risk Warnings:
⚠️ [Describe any risky, harmful, or important clauses. If none, say "No major risks detected."]

Practical Advice:
• [Actionable suggestion 1]
• [Actionable suggestion 2]
• [Actionable suggestion 3]

🔷 RULES (VERY IMPORTANT)

Follow these rules strictly:

Use simple language understandable by a 12-year-old.
Do NOT change the meaning of the document.
Do NOT add information that is not in the text.
Do NOT hallucinate details.
Do NOT provide legal, financial, or professional advice.
Keep explanations clear, short, and direct.
Focus only on important and relevant information.
If the document contains penalties, fees, deadlines, or obligations, highlight them clearly in Risk Warnings.
If no risks are found, explicitly state:
"No major risks detected."

🔷 TONE & STYLE GUIDELINES
Use plain, everyday English
Avoid legal or technical jargon
Use short sentences
Be clear and helpful
Do NOT sound robotic
Do NOT use complex vocabulary

🔷 CONTEXT AWARENESS

The document may belong to one of these categories:

Legal (contracts, agreements)
Financial (loans, payments, penalties)
Government (policies, regulations)
Educational (school rules, guidelines)
Employment (job offers, contracts)

Adapt your explanation style accordingly, but always keep it simple.

🔷 OPTIONAL (RECOMMENDED ADD-ON)

At the end of your response, include this disclaimer:

Disclaimer:
This explanation is for informational purposes only and does not constitute legal advice.`;

// ---------------------------------------------------------------------------
// Gemini client
// ---------------------------------------------------------------------------

function getAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not set. Please configure it in your environment.'
    );
  }
  return new GoogleGenAI({ apiKey });
}

// ---------------------------------------------------------------------------
// Response parser
// ---------------------------------------------------------------------------

function extractSection(text: string, header: string, nextHeaders: string[]): string {
  const headerPattern = new RegExp(`${header}[:\\s]*\\n`, 'i');
  const match = text.match(headerPattern);
  if (!match || match.index === undefined) return '';

  const start = match.index + match[0].length;
  let end = text.length;

  for (const nh of nextHeaders) {
    const nhPattern = new RegExp(`\\n${nh}[:\\s]*\\n`, 'i');
    const nhMatch = text.slice(start).match(nhPattern);
    if (nhMatch && nhMatch.index !== undefined) {
      const candidateEnd = start + nhMatch.index;
      if (candidateEnd < end) end = candidateEnd;
    }
  }

  return text.slice(start, end).trim();
}

function parseBulletPoints(section: string): string[] {
  if (!section) return [];
  return section
    .split('\n')
    .map((line) => line.replace(/^[•\-\*⚠️]\s*/, '').trim())
    .filter((line) => line.length > 0);
}

function deriveRiskLevel(warnings: string[]): AnalysisResult['riskLevel'] {
  if (warnings.length === 0) return 'None';
  const joined = warnings.join(' ').toLowerCase();
  if (joined.includes('no major risks detected')) return 'None';
  if (warnings.length >= 3) return 'High';
  if (warnings.length >= 2) return 'Medium';
  return 'Low';
}

function parseAnalysisResponse(rawText: string): AnalysisResult {
  const allHeaders = [
    'Document Title',
    'Document Category',
    'Simple Explanation',
    'Key Points',
    'Risk Warnings',
    'Practical Advice',
    'Disclaimer',
  ];

  const documentTitle =
    extractSection(rawText, 'Document Title', allHeaders.slice(1)) ||
    'Analyzed Document';

  const category =
    extractSection(rawText, 'Document Category', allHeaders.slice(2)) ||
    'General';

  const simpleExplanation =
    extractSection(rawText, 'Simple Explanation', allHeaders.slice(3)) ||
    'Unable to generate explanation. Please try again.';

  const keyPointsRaw = extractSection(rawText, 'Key Points', allHeaders.slice(4));
  const keyPoints = parseBulletPoints(keyPointsRaw);

  const riskWarningsRaw = extractSection(rawText, 'Risk Warnings', allHeaders.slice(5));
  const riskWarnings = parseBulletPoints(riskWarningsRaw);

  const practicalAdviceRaw = extractSection(rawText, 'Practical Advice', allHeaders.slice(6));
  const practicalAdvice = parseBulletPoints(practicalAdviceRaw);

  return {
    simpleExplanation,
    keyPoints: keyPoints.length > 0 ? keyPoints : ['No key points identified.'],
    riskWarnings,
    practicalAdvice:
      practicalAdvice.length > 0
        ? practicalAdvice
        : ['Review the document carefully before signing.'],
    documentTitle,
    category: category.replace(/\n/g, '').trim(),
    riskLevel: deriveRiskLevel(riskWarnings),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Analyze a document using the CiviLens AI engine (Gemini).
 *
 * @param documentText The raw text content of the document to analyze.
 * @returns A structured `AnalysisResult`.
 */
export async function analyzeDocument(documentText: string, imageFile?: { data: string, mimeType: string }): Promise<AnalysisResult> {
  if (!documentText.trim() && !imageFile) {
    throw new Error('Please provide document text or an image to analyze.');
  }

  const ai = getAIClient();

  const promptText = documentText.trim() 
    ? `Now analyze the following document text:\n\n${documentText}`
    : `Please analyze the provided image document.`;

  const requestContents: any[] = [{ text: promptText }];

  if (imageFile) {
    requestContents.push({
      inlineData: {
        data: imageFile.data,
        mimeType: imageFile.mimeType,
      }
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: requestContents,
    config: {
      systemInstruction: CIVILENS_SYSTEM_PROMPT,
      temperature: 0.3,          // Low temperature for factual, consistent output
      maxOutputTokens: 4096,
    },
  });

  const rawText = response.text;
  if (!rawText) {
    throw new Error('The AI did not return any content. Please try again.');
  }

  return parseAnalysisResponse(rawText);
}
