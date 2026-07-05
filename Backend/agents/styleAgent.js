import { GoogleGenAI } from "@google/genai";

export async function styleAgent(diffText) {

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
        You are a senior software engineer specializing in code quality.

        Review the following code changes:

        ${diffText}

        Focus ONLY on:
        - Readability
        - Naming conventions
        - Maintainability
        - Code organization
        - Best practices

        Do NOT comment on:
        - Bugs
        - Runtime errors
        - Security
        - Performance

        Return ONLY valid JSON in the following format:

        {
        "styleIssues": [
            {
            "severity": "High | Medium | Low",
            "title": "Short issue title",
            "description": "Detailed explanation",
            "recommendation": "Suggested improvement"
            }
        ]
        }

        If no issues are found, return:

        {
        "styleIssues": []
        }

        Return ONLY raw JSON.
        Do not wrap the response in markdown code blocks.
        `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text.trim();
}