import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const suggestListItems = async (listTitle: string, listType: string): Promise<string[]> => {
  const client = getClient();
  if (!client) return ["API Key Missing", "Check Setup"];

  try {
    const response = await client.models.generateContent({
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