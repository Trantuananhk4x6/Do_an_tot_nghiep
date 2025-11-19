import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { cvText } = await request.json();

    if (!cvText) {
      return NextResponse.json(
        { error: 'CV text is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze this CV and extract job-related information. Return a JSON object with the following structure:

{
  "skills": ["skill1", "skill2", ...], // Array of technical and soft skills
  "yearsOfExperience": 0, // Number of years of professional experience
  "currentLevel": "fresher", // One of: intern, fresher, junior, middle, senior, manager, director
  "suggestedLevel": ["fresher", "junior"], // Array of 1-2 suggested levels
  "mainField": "Software Developer", // Main field/role (e.g., Frontend Developer, Backend Developer, etc.)
  "location": "Ho Chi Minh", // Preferred work location
  "summary": "Brief summary of candidate" // 1-2 sentence summary
}

Guidelines:
- Extract all relevant technical skills (programming languages, frameworks, tools)
- Calculate years of experience based on work history
- Determine current level based on experience and responsibilities
- Suggest 1-2 appropriate job levels
- Identify main field/specialization
- Extract preferred location from address or mentioned cities
- Keep summary concise and professional

CV Content:
${cvText}

Return ONLY valid JSON, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from response
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const analysis = JSON.parse(jsonText);

    return NextResponse.json({ 
      success: true, 
      analysis 
    });

  } catch (error) {
    console.error('Error analyzing CV for job search:', error);
    
    // Return a basic fallback analysis
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze CV with AI',
      analysis: {
        skills: ['Programming', 'Problem Solving'],
        yearsOfExperience: 0,
        currentLevel: 'fresher',
        suggestedLevel: ['fresher', 'junior'],
        mainField: 'Software Developer',
        location: 'Ho Chi Minh',
        summary: 'Entry-level developer seeking opportunities'
      }
    }, { status: 500 });
  }
}
