import { GoogleGenAI } from "@google/genai";

export async function testAgent(diffText) {

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
        You are a senior QA engineer.

        Review the following code changes:

        ${diffText}

        Focus ONLY on:
        - Missing test cases
        - Edge cases that should be tested
        - Regression test suggestions

        Do NOT comment on:
        - Bugs
        - Code style
        - Security
        - Performance

        Return ONLY valid JSON in the following format:

        {
        "testSuggestions": [
            {
            "title": "Short test title",
            "description": "What should be tested",
            "priority": "High | Medium | Low"
            }
        ]
        }

        If no suggestions are needed, return:

        {
        "testSuggestions": []
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