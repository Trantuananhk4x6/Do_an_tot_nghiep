// Test script to verify Gemini API for Quiz generation
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('❌ No API key found in .env.local');
  process.exit(1);
}

console.log('✅ API Key found:', API_KEY.substring(0, 10) + '...');

const testPrompt = `Generate 2 multiple-choice technical questions about JavaScript.

Instructions:
- Each question must have exactly 4 options
- Return ONLY valid JSON in this format:

{
  "questions": [
    {
      "id": 1,
      "text": "What is a closure in JavaScript?",
      "options": ["A. A loop", "B. A function", "C. A variable", "D. An object"],
      "correctAnswer": 1,
      "explanation": "A closure is a function that has access to variables in its outer scope."
    }
  ]
}`;

const body = {
  contents: [
    {
      parts: [
        {
          text: testPrompt,
        },
      ],
    },
  ],
  generationConfig: {
    temperature: 0.3,
    maxOutputTokens: 4096,
    topK: 40,
    topP: 0.95,
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_NONE"
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_NONE"
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_NONE"
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_NONE"
    }
  ]
};

async function testGeminiAPI() {
  console.log('\n🔍 Testing Gemini API with gemini-1.5-flash...\n');
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    console.log('Response status:', response.status, response.statusText);
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ API Error:', JSON.stringify(data, null, 2));
      return;
    }
    
    console.log('\n✅ API Response received!');
    console.log('Full response:', JSON.stringify(data, null, 2));
    
    if (data.candidates && data.candidates[0]) {
      const candidate = data.candidates[0];
      console.log('\n📝 Finish Reason:', candidate.finishReason);
      
      if (candidate.content?.parts?.[0]?.text) {
        const text = candidate.content.parts[0].text;
        console.log('\n📄 Generated Text:');
        console.log(text);
        console.log('\n✅ SUCCESS! API is working correctly.');
      } else {
        console.error('\n❌ No text content in response');
      }
    } else {
      console.error('\n❌ No candidates in response');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGeminiAPI();
