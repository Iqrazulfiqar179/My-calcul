import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function askMathAI(prompt: string, context?: string) {
  try {
    const model = ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a helpful mathematical assistant. 
      The user is using a scientific calculator. 
      ${context ? `Current calculator state: ${context}` : ""}
      
      User question: ${prompt}
      
      Provide a clear, concise explanation or solution. Use markdown for formatting.`,
    });

    const response = await model;
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Failed to connect to AI service.";
  }
}
