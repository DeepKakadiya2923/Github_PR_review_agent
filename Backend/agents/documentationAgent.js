import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function documentationAgent(diffText) {
  const prompt = `
        You are a senior software engineer specializing in code documentation.

        Analyze the following GitHub Pull Request diff.

        Look ONLY for documentation-related issues:

        - Missing function comments
        - Missing JSDoc/TSDoc
        - Missing README updates
        - Missing API documentation
        - Complex logic without explanation
        - Public methods lacking documentation

        Return ONLY valid JSON:

        {
        "documentationIssues": [
            {
            "title": "",
            "description": "",
            "priority": "Low|Medium|High"
            }
        ]
        }

        If no issues exist:

        {
        "documentationIssues": []
        }

        PR Diff:

        ${diffText}
        `;

    const response =
        await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        });

    return response.text.trim();
}