import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Type definitions for better type safety
interface CVAnalysis {
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
    languages: string[];
  };
  experience: {
    totalYears: number;
    breakdown: {
      role: string;
      company: string;
      duration: string;
      years: number;
    }[];
  };
  level: {
    current: 'intern' | 'fresher' | 'junior' | 'middle' | 'senior' | 'manager' | 'director';
    suggested: ('intern' | 'fresher' | 'junior' | 'middle' | 'senior' | 'manager' | 'director')[];
    confidence: number;
  };
  career: {
    mainField: string;
    subFields: string[];
    targetRoles: string[];
  };
  location: {
    current: string;
    preferred: string[];
  };
  education: {
    degree: string;
    major: string;
    university: string;
    graduationYear?: number;
  }[];
  summary: {
    professional: string;
    strengths: string[];
    improvements: string[];
  };
  matchScore: {
    overall: number;
    breakdown: {
      experience: number;
      skills: number;
      education: number;
    };
  };
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Helper function to extract JSON from markdown
function extractJSON(text: string): string {
  let cleaned = text.trim();
  
  // Remove markdown code blocks
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/```\n?/g, '');
  }
  
  // Find JSON object boundaries
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  
  if (start !== -1 && end !== -1) {
    cleaned = cleaned.substring(start, end + 1);
  }
  
  return cleaned.trim();
}

// Enhanced prompt with better structure and instructions
function buildAnalysisPrompt(cvText: string): string {
  return `You are an expert HR analyst and career counselor. Analyze the following CV/Resume thoroughly and extract comprehensive information.

**IMPORTANT INSTRUCTIONS:**
1. Be precise and data-driven in your analysis
2. Base experience calculations on actual dates mentioned
3. Categorize skills accurately (don't mix technical with soft skills)
4. Consider industry standards for level classification
5. Return ONLY valid JSON - no explanations, no markdown, no additional text
6. If information is not available, use empty arrays [] or null

**LEVEL CLASSIFICATION GUIDE:**
- Intern: Currently studying, internship experience only
- Fresher: 0-1 years, recent graduate
- Junior: 1-3 years, working under supervision
- Middle: 3-5 years, independent work, mentoring juniors
- Senior: 5-8 years, technical leadership, complex projects
- Manager: 8+ years, people management, strategic decisions
- Director: 10+ years, department leadership, business strategy

**CV CONTENT:**
${cvText}

**REQUIRED JSON STRUCTURE:**
{
  "skills": {
    "technical": ["React", "Node.js", "Python"],
    "soft": ["Communication", "Leadership", "Problem-solving"],
    "tools": ["Git", "Docker", "VS Code"],
    "languages": ["English - Fluent", "Vietnamese - Native"]
  },
  "experience": {
    "totalYears": 3.5,
    "breakdown": [
      {
        "role": "Senior Frontend Developer",
        "company": "Tech Corp",
        "duration": "Jan 2021 - Present",
        "years": 3.5
      }
    ]
  },
  "level": {
    "current": "middle",
    "suggested": ["middle", "senior"],
    "confidence": 0.85
  },
  "career": {
    "mainField": "Frontend Development",
    "subFields": ["Web Development", "UI/UX"],
    "targetRoles": ["Senior Frontend Developer", "Tech Lead"]
  },
  "location": {
    "current": "Ho Chi Minh City",
    "preferred": ["Ho Chi Minh City", "Remote"]
  },
  "education": [
    {
      "degree": "Bachelor",
      "major": "Computer Science",
      "university": "University of Technology",
      "graduationYear": 2020
    }
  ],
  "summary": {
    "professional": "Experienced frontend developer with 3+ years specializing in React and modern web technologies",
    "strengths": [
      "Strong technical foundation in frontend technologies",
      "Proven track record in delivering scalable applications",
      "Good communication and team collaboration skills"
    ],
    "improvements": [
      "Consider gaining backend development experience",
      "Expand cloud deployment knowledge",
      "Obtain relevant certifications"
    ]
  },
  "matchScore": {
    "overall": 85,
    "breakdown": {
      "experience": 80,
      "skills": 90,
      "education": 85
    }
  }
}`;
}

// Fallback analysis for error cases
function getFallbackAnalysis(): CVAnalysis {
  return {
    skills: {
      technical: ['Programming'],
      soft: ['Problem Solving', 'Communication'],
      tools: [],
      languages: ['English']
    },
    experience: {
      totalYears: 0,
      breakdown: []
    },
    level: {
      current: 'fresher',
      suggested: ['fresher', 'junior'],
      confidence: 0.5
    },
    career: {
      mainField: 'Software Development',
      subFields: [],
      targetRoles: ['Junior Developer']
    },
    location: {
      current: 'Unknown',
      preferred: []
    },
    education: [],
    summary: {
      professional: 'Entry-level professional seeking opportunities',
      strengths: ['Eager to learn', 'Adaptable'],
      improvements: ['Gain more practical experience', 'Build project portfolio']
    },
    matchScore: {
      overall: 50,
      breakdown: {
        experience: 40,
        skills: 50,
        education: 60
      }
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const { cvText } = await request.json();

    // Validation
    if (!cvText || typeof cvText !== 'string') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Valid CV text is required',
          details: 'cvText must be a non-empty string'
        },
        { status: 400 }
      );
    }

    if (cvText.length < 100) {
      return NextResponse.json(
        { 
          success: false,
          error: 'CV text is too short',
          details: 'Please provide a more detailed CV (minimum 100 characters)'
        },
        { status: 400 }
      );
    }

    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return NextResponse.json(
        { 
          success: false,
          error: 'Service configuration error',
          analysis: getFallbackAnalysis()
        },
        { status: 500 }
      );
    }

    // Initialize Gemini with optimized settings
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-exp',
      generationConfig: {
        temperature: 0.2, // Lower temperature for more consistent outputs
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 2048,
      }
    });

    // Build optimized prompt
    const prompt = buildAnalysisPrompt(cvText);

    // Generate analysis with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Analysis timeout')), 30000)
    );

    const analysisPromise = model.generateContent(prompt);
    
    const result = await Promise.race([analysisPromise, timeoutPromise]) as any;
    const response = result.response;
    const text = response.text();

    // Extract and parse JSON
    const jsonText = extractJSON(text);
    
    let analysis: CVAnalysis;
    try {
      analysis = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw response:', text);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate analysis structure
    if (!analysis.skills || !analysis.experience || !analysis.level) {
      console.warn('Incomplete analysis structure, using fallback');
      analysis = { ...getFallbackAnalysis(), ...analysis };
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      analysis,
      metadata: {
        timestamp: new Date().toISOString(),
        model: 'gemini-2.5-flash-exp',
        cvLength: cvText.length
      }
    });

  } catch (error: any) {
    console.error('Error analyzing CV:', error);

    // Detailed error logging
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };

    // Return fallback analysis with error info
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze CV with AI',
      details: error.message,
      analysis: getFallbackAnalysis(),
      errorInfo: process.env.NODE_ENV === 'development' ? errorDetails : undefined
    }, { status: 500 });
  }
}

// Optional: Add GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'CV Analysis API',
    version: '2.0',
    endpoints: {
      analyze: 'POST /api/cv-analysis'
    }
  });
}