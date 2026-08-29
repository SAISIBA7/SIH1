import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: 'Missing text or targetLanguage' }, { status: 400 });
    }

    // Use MyMemory Free Translation API
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const errText = await response.text();
      console.error('MyMemory API error:', response.status, errText);
      throw new Error(`Translation API failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Check if the API returned an error message in the translatedText (e.g., quota exceeded)
    let translatedText = data.responseData?.translatedText || text;
    
    if (data.responseStatus !== 200) {
       console.warn('MyMemory API warning:', data.responseDetails);
    }

    return NextResponse.json({ translatedText });
  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
