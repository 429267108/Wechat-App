import { GoogleGenAI, Type } from "@google/genai";

// Guideline: Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
// We assume process.env.API_KEY is available and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const suggestListItems = async (listTitle: string, listType: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 5 creative and cute items for a ${listType} titled "${listTitle}". Keep them short (under 6 words). Return as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini suggestion failed:", error);
    return ["Buy sparkles", "Drink tea", "Pet a cat"]; // Fallback cute items
  }
};