import { NextRequest, NextResponse } from 'next/server';

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!DEEPGRAM_API_KEY) {
      return NextResponse.json(
        { error: 'Deepgram API key not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const audioBlob = formData.get('audio') as Blob;
    const language = formData.get('language') as string || 'en-US';

    if (!audioBlob) {
      return NextResponse.json(
        { error: 'No audio data provided' },
        { status: 400 }
      );
    }

    // Map language codes to Deepgram format
    const languageMap: Record<string, string> = {
      'vi-VN': 'vi',
      'en-US': 'en-US',
      'ja-JP': 'ja',
      'zh-CN': 'zh-CN',
      'ko-KR': 'ko'
    };

    const deepgramLanguage = languageMap[language] || 'en-US';

    console.log('🎙️ Deepgram transcription request:', {
      language,
      deepgramLanguage,
      audioSize: audioBlob.size
    });

    // Convert blob to buffer
    const arrayBuffer = await audioBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Call Deepgram API
    const response = await fetch(
      `https://api.deepgram.com/v1/listen?language=${deepgramLanguage}&model=nova-2&smart_format=true`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Token ${DEEPGRAM_API_KEY}`,
          'Content-Type': 'audio/webm',
        },
        body: buffer,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Deepgram API error:', errorText);
      return NextResponse.json(
        { error: 'Deepgram transcription failed', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
    const confidence = data.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0;

    console.log('✅ Deepgram transcription:', { transcript, confidence });

    return NextResponse.json({
      success: true,
      transcript,
      confidence,
      language: deepgramLanguage
    });

  } catch (error: any) {
    console.error('❌ Transcription error:', error);
    return NextResponse.json(
      { error: 'Transcription failed', details: error.message },
      { status: 500 }
    );
  }
}
