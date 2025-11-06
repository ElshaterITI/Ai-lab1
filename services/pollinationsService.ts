import axios from "axios";

export const generateImageFromPollinations = async (
    prompt: string
): Promise<string> => {
    if (!prompt.trim()) {
        throw new Error("Prompt cannot be empty");
    }

    try {
        // Encode the prompt for URL
        const encodedPrompt = encodeURIComponent(prompt);

        // Pollinations.ai URL with prompt
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;

        // Validate if the image exists/is accessible
        await axios.head(imageUrl);

        return imageUrl;
    } catch (error) {
        throw new Error("Failed to generate image using Pollinations.ai");
    }
};
