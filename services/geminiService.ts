
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function smartTransliterate(text: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Transliterate the following "Singlish" (Sinhala written in English phonetics) text into proper Sinhala Unicode. Output ONLY the Sinhala text. 
      Text: "${text}"`,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function fixGrammar(text: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The following is Sinhala text. Please fix any spelling or grammar mistakes and make it natural. Output ONLY the fixed Sinhala text.
      Text: "${text}"`,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function translateToEnglish(text: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Translate the following Sinhala text to English:
        Text: "${text}"`,
      });
      return response.text?.trim() || "";
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
}
