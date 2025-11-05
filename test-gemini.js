// Test Google Gemini API connection
require('dotenv').config({ path: '.env.local' });

async function testGeminiAPI() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  
  console.log('🔍 Testing Gemini API...');
  console.log('API Key exists:', !!apiKey);
  console.log('API Key prefix:', apiKey ? apiKey.substring(0, 15) + '...' : 'NOT FOUND');
  
  if (!apiKey) {
    console.error('❌ GOOGLE_GENERATIVE_AI_API_KEY not found in .env.local');
    process.exit(1);
  }

  try {
    // Test with a simple API call
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Say "Hello, API is working!" in JSON format: {"message": "..."}'
            }]
          }]
        })
      }
    );

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, response.statusText);
      console.error('Error details:', errorText);
      
      if (response.status === 429) {
        console.log('⚠️ Rate limit exceeded. Wait a moment and try again.');
      } else if (response.status === 403) {
        console.log('⚠️ API key might be invalid or restricted.');
      }
      process.exit(1);
    }

    const data = await response.json();
    console.log('✅ API Response:', JSON.stringify(data, null, 2));
    console.log('✅ Gemini API is working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    process.exit(1);
  }
}

testGeminiAPI();
