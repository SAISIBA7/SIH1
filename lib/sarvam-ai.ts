import { SarvamAIClient } from 'sarvamai';

const SARVAM_API_KEY =
  process.env.SARVAM_API_KEY ||
  process.env.NEXT_PUBLIC_SARVAM_API_KEY ||
  '';

export const sarvamClient = new SarvamAIClient({
  apiSubscriptionKey: SARVAM_API_KEY || 'unconfigured_sarvam_key',
});

/**
 * Mapping from short codes to Sarvam AI language codes (BCP-47)
 */
export const SARVAM_LANGUAGE_MAP: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  or: 'od-IN',
  od: 'od-IN',
  bn: 'bn-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  as: 'as-IN',
  ur: 'ur-IN',
  ne: 'ne-IN',
  sa: 'sa-IN',
  mai: 'mai-IN',
  sd: 'sd-IN',
  ks: 'ks-IN',
  kok: 'kok-IN',
  mni: 'mni-IN',
  brx: 'brx-IN',
  doi: 'doi-IN',
  sat: 'sat-IN',
};

export interface TranslateOptions {
  input: string;
  sourceLanguageCode?: string;
  targetLanguageCode: string;
  model?: string;
}

/**
 * Translate text using Sarvam AI Indic models (Supports all 22 Official Scheduled Indian Languages)
 */
export async function translateWithSarvam({
  input,
  sourceLanguageCode = 'en-IN',
  targetLanguageCode,
  model = 'sarvam-translate:v1',
}: TranslateOptions) {
  const sourceCode = SARVAM_LANGUAGE_MAP[sourceLanguageCode] || sourceLanguageCode;
  const targetCode = SARVAM_LANGUAGE_MAP[targetLanguageCode] || targetLanguageCode;

  try {
    const response: any = await (sarvamClient.text as any).translate({
      input,
      source_language_code: sourceCode,
      target_language_code: targetCode,
      model,
    });
    return {
      success: true,
      translatedText: response.translated_text,
      raw: response,
    };
  } catch (error: any) {
    console.error('Sarvam AI Translation Error:', error);
    return {
      success: false,
      error: error.message || 'Sarvam AI translation error',
    };
  }
}

/**
 * Generate Voice Audio (Text to Speech) using Sarvam AI
 */
export async function textToSpeechWithSarvam({
  text,
  targetLanguageCode = 'hi-IN',
  speaker = 'meera',
}: {
  text: string;
  targetLanguageCode?: string;
  speaker?: string;
}) {
  const targetCode = SARVAM_LANGUAGE_MAP[targetLanguageCode] || targetLanguageCode;

  try {
    const response: any = await (sarvamClient.textToSpeech as any).convert({
      inputs: [text],
      target_language_code: targetCode,
      speaker,
    });
    return {
      success: true,
      audios: response.audios,
      raw: response,
    };
  } catch (error: any) {
    console.error('Sarvam AI TTS Error:', error);
    return {
      success: false,
      error: error.message || 'Sarvam AI TTS error',
    };
  }
}
