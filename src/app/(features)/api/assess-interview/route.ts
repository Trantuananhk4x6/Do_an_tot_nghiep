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
    const body = await request.json();
    const { interviewSession }: AssessmentAPIRequest = body;

    
    

    // Validate input
    if (!interviewSession) {
      console.error('❌ No interview session in request');
      return NextResponse.json({
        success: false,
        error: 'No interview session provided'
      } as AssessmentAPIResponse, { status: 400 });
    }

    if (!interviewSession.transcript || !Array.isArray(interviewSession.transcript)) {
      console.error('❌ Invalid transcript data');
      return NextResponse.json({
        success: false,
        error: 'Invalid transcript data'
      } as AssessmentAPIResponse, { status: 400 });
    }

    if (interviewSession.transcript.length === 0) {
      console.error('❌ Empty transcript');
      return NextResponse.json({
        success: false,
        error: 'Interview transcript is empty'
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
    

    // Call Gemini API with retry logic for rate limits
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      }
    });
  
    
    let result;
    let retries = 3;
    let lastError;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        
        result = await model.generateContent(prompt);
        
        break; // Success, exit retry loop
      } catch (geminiError: any) {
        lastError = geminiError;
        console.error(`❌ Attempt ${attempt} failed:`, geminiError.message);
        
        // Check if it's a rate limit error
        const errorMessage = geminiError.message?.toLowerCase() || '';
        const isRateLimit = errorMessage.includes('rate limit') || 
                           errorMessage.includes('quota') || 
                           errorMessage.includes('429') ||
                           geminiError.status === 429;
        
        if (isRateLimit) {
          console.warn('⚠️ Rate limit detected, waiting before retry...');
          
          if (attempt < retries) {
            // Exponential backoff: 2s, 4s, 8s
            const waitTime = Math.pow(2, attempt) * 1000;
            
            await new Promise(resolve => setTimeout(resolve, waitTime));
          } else {
            console.error('❌ Max retries reached, rate limit exceeded');
            return NextResponse.json({
              success: false,
              error: 'AI service rate limit exceeded. Please try again in a few moments.'
            } as AssessmentAPIResponse, { status: 429 });
          }
        } else {
          // Not a rate limit error, fail immediately
          console.error('❌ Non-recoverable Gemini API error:', geminiError);
          return NextResponse.json({
            success: false,
            error: `AI service error: ${geminiError.message || 'Unknown error'}`
          } as AssessmentAPIResponse, { status: 500 });
        }
      }
    }
    
    if (!result || !result.response) {
      console.error('❌ No response from Gemini after retries');
      return NextResponse.json({
        success: false,
        error: lastError ? `AI service error: ${lastError.message}` : 'No response from AI service'
      } as AssessmentAPIResponse, { status: 500 });
    }
    
    const response = (result as any).response.text();
    

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
