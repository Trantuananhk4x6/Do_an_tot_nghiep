// Test Gemini Model Availability
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  console.log('🔍 Testing Gemini API Configuration...\n');
  
  // Check API keys from environment
  const apiKey = 'AIzaSyBxi85FIgFuYf8X94RJsMFTaL2UJ_Yukag'; // Your API key from .env.local
  
  console.log(`📋 Using API Key: ${apiKey.substring(0, 20)}...\n`);
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Test different models
  const modelsToTest = [
    'gemini-2.0-flash-exp',
    'gemini-2.0-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
  ];
  
  console.log('🧪 Testing Models:\n');
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say OK');
      const text = result.response.text();
      console.log(`  ✅ ${modelName}: SUCCESS`);
      console.log(`     Response: ${text}\n`);
      return modelName; // Return first successful model
    } catch (error) {
      console.log(`  ❌ ${modelName}: FAILED`);
      console.log(`     Error: ${error.message}\n`);
    }
  }
  
  console.log('❌ All models failed!');
  return null;
}

testGemini()
  .then(model => {
    if (model) {
      console.log(`\n✅ Recommended model: ${model}`);
    }
  })
  .catch(err => console.error('Fatal error:', err));
