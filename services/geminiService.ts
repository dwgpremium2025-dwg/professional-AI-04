
import { GoogleGenAI } from "@google/genai";

// Fix for TS2580: Cannot find name 'process'
declare const process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  }
};

const getApiKey = (): string => {
  // Always use the injected process.env.API_KEY
  if (process.env.API_KEY) {
    return process.env.API_KEY;
  }
  throw new Error("API_KEY_MISSING");
};

export const geminiService = {
  /**
   * Generates an image or edits an image using Gemini.
   */
  generateImage: async (
    prompt: string,
    mainImageBase64?: string,
    mainMimeType?: string,
    refImageBase64?: string,
    refMimeType?: string,
    useProModel: boolean = false
  ): Promise<string> => {
    
    // Per rules: Create a new instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    const model = useProModel ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

    const parts: any[] = [];
    
    let finalPrompt = prompt;
    if (mainImageBase64 && refImageBase64) {
      finalPrompt = `
      TASK: Generate a high-quality architectural image.
      
      INPUTS:
      1. [First Image provided]: STRUCTURE REFERENCE.
      2. [Second Image provided]: STYLE/ENVIRONMENT REFERENCE.
      3. User Instruction: "${prompt}"

      STRICT CONSTRAINTS:
      - STRUCTURE: You MUST preserve the architectural form, perspective, geometry, and main subject of the First Image.
      - STYLE: You MUST apply the lighting, color palette, sky, mood, and surrounding landscape style of the Second Image to the First Image.
      - OUTPUT: A seamless blend.
      `;
    }

    parts.push({ text: finalPrompt });

    if (mainImageBase64 && mainMimeType) {
      parts.push({
        inlineData: {
          data: mainImageBase64,
          mimeType: mainMimeType
        }
      });
    }

    if (refImageBase64 && refMimeType) {
      parts.push({
        inlineData: {
          data: refImageBase64,
          mimeType: refMimeType
        }
      });
    }

    try {
      const config: any = {};
      if (useProModel) {
        config.imageConfig = { imageSize: "2K" };
      }

      const response = await ai.models.generateContent({
        model: model,
        contents: { parts },
        config: config as any // Cast to any to bypass strict GenerateContentConfig checking for imageConfig
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return part.inlineData.data;
          }
        }
      }
      
      throw new Error("No image generated.");
    } catch (error: any) {
      console.error("Gemini Image Gen Error:", error);
      // Re-throw specific key error for UI to handle
      if (error.message && error.message.includes("Requested entity was not found")) {
          throw new Error("PROJECT_KEY_INVALID");
      }
      throw error;
    }
  },

  /**
   * Upscales an image to 4K using the Pro model.
   */
  upscaleImage4K: async (imageBase64: string, mimeType: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const model = 'gemini-3-pro-image-preview';

    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: {
          parts: [
            { inlineData: { data: imageBase64, mimeType: mimeType } },
            { text: "Upscale this image to 4K resolution, enhancing details while preserving the original composition and style." }
          ]
        },
        config: {
            imageConfig: { imageSize: "4K" }
        } as any
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return part.inlineData.data;
          }
        }
      }
      
      throw new Error("Failed to upscale image.");
    } catch (error: any) {
      if (error.message && error.message.includes("Requested entity was not found")) {
          throw new Error("PROJECT_KEY_INVALID");
      }
      throw error;
    }
  }
};
