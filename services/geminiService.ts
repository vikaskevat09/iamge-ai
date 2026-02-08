
import { GoogleGenAI } from "@google/genai";
import { GenerationParams, AspectRatio, ImageStyle } from '../types';

/**
 * Key Rotation Pool
 * Automatically cycles through these keys if the primary one hits a limit.
 */
const API_KEYS = [
  process.env.API_KEY,
  'AIzaSyBc7Lc14oDlBO3BcU9TYKHqDSMHbQFHB8Y',
  'AIzaSyDS3_dYLuU5EgvvdCmFJqOSz8AJ25Kf3Bg',
  'AIzaSyDpy-8imTj7bisfd0Vx1nrvoL4vRr28QRA',
  'AIzaSyCBR8ZCz_51oqRdfDSWKHicPa4TKryNyi8'
].filter(Boolean) as string[];

let currentKeyIndex = 0;

/**
 * Helper to get the current working API key
 */
const getActiveKey = () => API_KEYS[currentKeyIndex];

/**
 * Rotates the key index to the next available one in the pool
 */
const rotateKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  console.log(`[Luminary AI] API Key exhausted. Rotating to engine #${currentKeyIndex + 1}`);
};

/**
 * Uses a neural model to expand a simple user prompt into a high-detail artistic description.
 * Optimized for speed with zero thinking budget and concise output.
 * Includes automatic key rotation on failure.
 */
export const improvePrompt = async (userPrompt: string, retryCount = 0): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getActiveKey() });
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `Professional art prompt expander. Expand concept to 40-60 words. 
  Focus on: lighting, texture, composition, mood. Direct text only. No intro/outro.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });
    return response.text.trim();
  } catch (error: any) {
    const isRateLimit = error.message?.includes("429") || error.message?.includes("quota");
    
    if (isRateLimit && retryCount < API_KEYS.length) {
      rotateKey();
      return improvePrompt(userPrompt, retryCount + 1);
    }
    
    console.error("Failed to improve prompt:", error);
    return userPrompt;
  }
};

/**
 * Generates an image using the fastest available vision synthesis model.
 * Automatically rotates keys if a quota limit is reached.
 */
export const generateAIImage = async (params: GenerationParams, retryCount = 0): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getActiveKey() });
  
  let finalPrompt = params.prompt;
  if (params.style !== ImageStyle.NONE) {
    finalPrompt = `Art Style: ${params.style}. ${finalPrompt}. High resolution.`;
  }

  const modelName = 'gemini-2.5-flash-image';

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [{ text: finalPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: params.aspectRatio
        }
      }
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("Empty results.");
    }

    const part = candidates[0].content.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }

    throw new Error("Synthesis failed.");
  } catch (error: any) {
    const errorMessage = error.message || "";
    const isRateLimit = errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("exhausted");
    
    // If the request fails with a quota error, rotate the key and try again immediately.
    if (isRateLimit && retryCount < API_KEYS.length) {
      rotateKey();
      return generateAIImage(params, retryCount + 1);
    }

    if (errorMessage.includes("permission") || errorMessage.includes("403") || errorMessage.includes("Requested entity was not found.")) {
      throw new Error("PRO_KEY_REQUIRED");
    }
    
    throw new Error(errorMessage || "Synthesis disrupted.");
  }
};
