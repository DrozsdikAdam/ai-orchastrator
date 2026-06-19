import { prisma } from "@repo/database";
import { decrypt } from "../lib/crypto";
import OpenAI from "openai";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const llmHandler = async (data: Record<string, any>, context: Record<string, any>, userId: string) => {
    try {
        const { model, prompt, temperature = 0.7, maxTokens = 1024 } = data;

        if (!model || typeof model !== "string") {
            throw new Error("Missing or invalid model.");
        }
        if (!prompt || typeof prompt !== "string") {
            throw new Error("Missing or invalid prompt.");
        }

        const modelLower = model.toLowerCase();
        let provider = "groq";
        if (modelLower.includes("gpt")) {
            provider = "openai";
        } else if (modelLower.includes("gemini")) {
            provider = "gemini";
        }

        const apiKeyRecord = await prisma.apiKey.findFirst({
            where: {
                provider,
                userId,
            },
        });

        if (!apiKeyRecord) {
            throw new Error(`No API key found for provider: ${provider}`);
        }

        const decryptedKey = decrypt(apiKeyRecord.key);
        let responseText = "";

        switch (provider) {
            case "openai": {
                const openai = new OpenAI({ apiKey: decryptedKey });
                const response = await openai.chat.completions.create({
                    model,
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                    temperature,
                    max_tokens: maxTokens,
                });
                responseText = response.choices[0]?.message?.content || "";
                break;
            }

            case "gemini": {
                const genAI = new GoogleGenerativeAI(decryptedKey);
                const geminiModel = genAI.getGenerativeModel({
                    model,
                    generationConfig: {
                        temperature,
                        maxOutputTokens: maxTokens,
                    },
                });
                const result = await geminiModel.generateContent(prompt);
                responseText = result.response.text();
                break;
            }

            case "groq": {
                const groq = new Groq({ apiKey: decryptedKey });
                const response = await groq.chat.completions.create({
                    model,
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                    temperature,
                    max_tokens: maxTokens,
                });
                responseText = response.choices[0]?.message?.content || "";
                break;
            }

            default:
                throw new Error("Unknown provider.");
        }

        return { output: responseText };
    } catch (error: any) {
        throw new Error(`LLM request failed: ${error.message || error}`);
    }
};