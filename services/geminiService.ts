
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { CoFounderResponse } from "../types";

export class GeminiService {
  constructor() {}

  async generateResponse(history: { role: string; parts: { text: string }[] }[]): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
      },
    });

    return response.text || "PROTOCOL_FAILURE: NO_OUTPUT";
  }

  parseResponse(text: string): CoFounderResponse {
    // Helper to clean markdown artifacts like **
    const clean = (str: string) => str.replace(/\*\*/g, '').trim();

    const extractSection = (marker: string, nextMarkers: string[]) => {
      const startIdx = text.indexOf(marker);
      if (startIdx === -1) return "";
      
      let endIdx = text.length;
      for (const next of nextMarkers) {
        const idx = text.indexOf(next, startIdx + marker.length);
        if (idx !== -1 && idx < endIdx) {
          endIdx = idx;
        }
      }
      
      return clean(text.substring(startIdx + marker.length, endIdx));
    };

    const markers = [
      "1. CURRENT STATE SUMMARY:",
      "2. NEXT BEST ACTION:",
      "3. MAJOR RISK ALERT:",
      "4. TODAY'S METRIC:",
      "5. 60-MINUTE TASK:",
      "6. VALIDATION SCORE:",
      "7. OPERATIONAL INSIGHT:"
    ];

    const scoreMatch = text.match(/VALIDATION SCORE[:\s*]*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;

    return {
      summary: extractSection(markers[0], [markers[1]]),
      nextAction: extractSection(markers[1], [markers[2]]),
      riskAlert: extractSection(markers[2], [markers[3]]),
      metric: extractSection(markers[3], [markers[4]]),
      task60Min: extractSection(markers[4], [markers[5]]),
      validationScore: score,
      insight: extractSection(markers[6], []),
    };
  }
}
