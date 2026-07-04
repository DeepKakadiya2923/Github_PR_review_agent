import { GoogleGenAI } from "@google/genai";

export async function bugAgent(diffText) {


    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
        You are a senior software engineer specializing in code review.

        Review the following code changes:

        ${diffText}

        Focus ONLY on:
        - Logical bugs
        - Runtime errors
        - Edge cases

        Do NOT comment on:
        - Code style
        - Formatting
        - Documentation
        - Naming conventions
        - Performance
        - Security

        Return ONLY valid JSON in the following format:

        {
        "bugs": [
            {
            "severity": "High | Medium | Low",
            "title": "Short bug title",
            "description": "Detailed explanation",
            "recommendation": "Suggested fix"
            }
        ]
        }

        If no bugs are found, return:

        {
        "bugs": []
        }

        Return ONLY raw JSON.
        Do not wrap the response in markdown code blocks.
        Do not use \`\`\`json.
        Do not add any explanation before or after the JSON.
        `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text.trim();
}