import { ResponseType } from "../types";
import { generateContentFromApi as generateTextFromGemini } from "./geminiService";
import { generateImageFromPollinations } from "./pollinationsService";

export const generateContent = async (
    prompt: string,
    type: ResponseType
): Promise<string> => {
    if (type === "text") {
        return generateTextFromGemini(prompt, type);
    } else {
        return generateImageFromPollinations(prompt);
    }
};
