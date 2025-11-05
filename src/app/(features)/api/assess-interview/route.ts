import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildAssessmentPrompt } from '@/app/(features)/mock-interview/utils/assessmentPrompt';
import type { 
  InterviewSession, 
  AssessmentResult 
} from '@/app/(features)/mock-interview/types/assessment';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface AssessmentAPIRequest {
  interviewSession: InterviewSession;
}

interface AssessmentAPIResponse {
  success: boolean;
  assessment?: AssessmentResult;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { interviewSession }: AssessmentAPIRequest = await request.json();

    console.log('🔍 Generating assessment for session:', interviewSession.sessionId);
    console.log('📝 Transcript entries:', interviewSession.transcript.length);
    console.log('⏱️ Duration:', interviewSession.duration, 'seconds');

    // Validate input
    if (!interviewSession || !interviewSession.transcript || interviewSession.transcript.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No interview data provided'
      } as AssessmentAPIResponse, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not configured');
      return NextResponse.json({
        success: false,
        error: 'API key not configured'
      } as AssessmentAPIResponse, { status: 500 });
    }

    // Build AI prompt
    const prompt = buildAssessmentPrompt(interviewSession);
    console.log('📄 Prompt built, length:', prompt.length);

    // Call Gemini API
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      }
    });
    
    console.log('🤖 Calling Gemini API...');
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    console.log('✅ Received response, length:', response.length);

    // Parse JSON response
    let jsonText = response.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    // Try to parse JSON
    let assessment: AssessmentResult;
    try {
      assessment = JSON.parse(jsonText);
      console.log('✅ Assessment parsed successfully');
      console.log('📊 Overall Score:', assessment.overallScore);
      console.log('🎯 Readiness Level:', assessment.readinessLevel);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      console.error('Response text:', jsonText.substring(0, 500));
      
      return NextResponse.json({
        success: false,
        error: 'Failed to parse AI response'
      } as AssessmentAPIResponse, { status: 500 });
    }

    // Validate assessment structure
    if (!assessment.scores || !assessment.overallScore || !assessment.skillsRadar) {
      console.error('❌ Invalid assessment structure');
      return NextResponse.json({
        success: false,
        error: 'Invalid assessment structure from AI'
      } as AssessmentAPIResponse, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      assessment 
    } as AssessmentAPIResponse);

  } catch (error) {
    console.error('❌ Error generating assessment:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate assessment'
      } as AssessmentAPIResponse,
      { status: 500 }
    );
  }
}
