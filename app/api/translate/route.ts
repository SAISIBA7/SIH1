import { NextRequest, NextResponse } from 'next/server';
import { translateWithSarvam } from '@/lib/sarvam-ai';

export async function POST(req: NextRequest) {
  try {
    const { text, targetLanguage, sourceLanguage = 'en' } = await req.json();

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: 'Missing text or targetLanguage' }, { status: 400 });
    }

    if (targetLanguage === 'en' && sourceLanguage === 'en') {
      return NextResponse.json({ translatedText: text });
    }

    // 1. Primary: Sarvam AI Indic Neural Translation
    try {
      const sarvamRes = await translateWithSarvam({
        input: text,
        sourceLanguageCode: sourceLanguage,
        targetLanguageCode: targetLanguage,
      });

      if (sarvamRes.success && sarvamRes.translatedText) {
        return NextResponse.json({
          translatedText: sarvamRes.translatedText,
          engine: 'sarvamai',
        });
      }
    } catch (sErr) {
      console.warn('[Sarvam AI Attempt failed]:', sErr);
    }

    // 2. Secondary fallback: Google Translate Web API endpoint
    try {
      const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sourceLanguage)}&tl=${encodeURIComponent(targetLanguage)}&dt=t&q=${encodeURIComponent(text)}`;
      const gRes = await fetch(gUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      });
      if (gRes.ok) {
        const gData = await gRes.json();
        if (Array.isArray(gData) && Array.isArray(gData[0])) {
          const translated = gData[0].map((item: any) => item[0]).join('');
          if (translated && !translated.toLowerCase().includes('error')) {
            return NextResponse.json({ translatedText: translated, engine: 'google' });
          }
        }
      }
    } catch (gErr) {
      console.warn('[Google Translate Attempt failed]:', gErr);
    }

    // Default fallback: Return original text gracefully
    return NextResponse.json({ translatedText: text, engine: 'fallback' });
  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json({ translatedText: '', error: error.message }, { status: 500 });
  }
}
