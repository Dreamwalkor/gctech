import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

export const analyzeTelemetry = async (
  contextData: string,
  userPrompt: string
): Promise<string> => {
  try {
    const ai = getClient();
    const model = 'gemini-2.5-flash';

    const prompt = `
    CONTEXT DATA (JSON Summary of Telemetry):
    ${contextData}

    USER QUESTION:
    ${userPrompt}
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for analytical precision
      },
    });

    return response.text || "No analysis could be generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Error connecting to AI Analysis Engine. Please check your API Key.";
  }
};
