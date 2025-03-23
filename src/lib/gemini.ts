import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
// You'll need to replace this with your actual API key or set it as an environment variable
export const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// Initialize the Google Generative AI client
export const genAI = new GoogleGenerativeAI(geminiApiKey);

// Get the Gemini model (Flash-001)
export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-001',
});

// Function to generate a chat response
export async function generateResponse(prompt: string): Promise<string> {
  try {
    if (!geminiApiKey) {
      return "Error: Gemini API key is not set. Please set the NEXT_PUBLIC_GEMINI_API_KEY environment variable.";
    }

    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
} 