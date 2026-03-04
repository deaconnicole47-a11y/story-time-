import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
};

export async function generateStory(prompt: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are a storyteller for kids. Write a short story in 5 pages. Return the story as a JSON array of objects, each with 'pageNumber' and 'text'.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            pageNumber: { type: Type.INTEGER },
            text: { type: Type.STRING },
          },
        },
      },
    },
  });
  return JSON.parse(response.text || "[]");
}

export async function generateImage(prompt: string, size: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size as "1K" | "2K" | "4K",
      },
    },
  });
  
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}

export async function generateSpeech(text: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (base64Audio) {
    return `data:audio/wav;base64,${base64Audio}`;
  }
  return null;
}

export async function chatWithBot(message: string, history: any[]) {
  const ai = getAI();
  const chat = ai.chats.create({
    model: "gemini-3.1-pro-preview",
  });
  
  // Add history to chat
  for (const msg of history) {
    await chat.sendMessage({ message: msg.text });
  }

  const response = await chat.sendMessage({ message: message });
  return response.text;
}
