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

        Only comment on code that was changed in the diff.

        Do not review unrelated parts of the project.

        Do not suggest project-wide refactoring.

        Do not comment on dependency versioning strategies
        unless the change directly introduces a maintainability issue.

        If no style issues are present in the changed lines,
        return an empty styleIssues array.

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

    const response =
        await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        });

    return response.text.trim();
}