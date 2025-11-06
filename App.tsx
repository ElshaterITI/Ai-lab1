import React, { useState, useCallback } from "react";
import { ResponseType } from "./types";
import { generateContent } from "./services/contentService";

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <svg
            className="animate-spin h-12 w-12 text-purple-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
        <p className="text-gray-400">Generating content, please wait...</p>
    </div>
);

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>("");
    const [responseType, setResponseType] = useState<ResponseType>("text");
    const [response, setResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResponse(null);

        try {
            const result = await generateContent(prompt, responseType);
            setResponse(result);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [prompt, responseType]);

    const ResponseDisplay: React.FC = () => {
        if (isLoading) {
            return <LoadingSpinner />;
        }
        if (error) {
            return <div className="text-red-400 text-center">{error}</div>;
        }
        if (response) {
            if (responseType === "text") {
                return (
                    <p className="whitespace-pre-wrap text-gray-300">
                        {response}
                    </p>
                );
            } else {
                return (
                    <img
                        src={response}
                        alt="Generated content"
                        className="rounded-lg max-w-full h-auto shadow-lg"
                    />
                );
            }
        }
        return (
            <p className="text-gray-500">
                Your generated content will appear here.
            </p>
        );
    };

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
            <div className="w-full max-w-3xl">
                <header className="text-center my-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                        Best Content Generator
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Create text or images with the power of AI.
                    </p>
                </header>

                <main>
                    <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-gray-700">
                        <div className="flex flex-col space-y-4">
                            <label
                                htmlFor="prompt"
                                className="font-semibold text-lg"
                            >
                                Your Prompt
                            </label>
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., A futuristic cityscape at sunset"
                                className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none transition-shadow duration-200"
                                rows={4}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                            <div className="flex items-center space-x-2 p-1 bg-gray-900 rounded-lg">
                                <button
                                    onClick={() => setResponseType("text")}
                                    disabled={isLoading}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                        responseType === "text"
                                            ? "bg-purple-600 text-white"
                                            : "text-gray-400 hover:bg-gray-700"
                                    }`}
                                >
                                    Text
                                </button>
                                <button
                                    onClick={() => setResponseType("image")}
                                    disabled={isLoading}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                        responseType === "image"
                                            ? "bg-purple-600 text-white"
                                            : "text-gray-400 hover:bg-gray-700"
                                    }`}
                                >
                                    Image
                                </button>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                {isLoading ? "Generating..." : "Generate"}
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 w-full min-h-[300px] flex items-center justify-center p-6 bg-gray-800/50 rounded-xl shadow-2xl border border-gray-700">
                        <ResponseDisplay />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
