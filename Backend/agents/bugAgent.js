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
        - Hypothetical compatibility issues
        - Dependency upgrade risks without evidence
        - Possible future problems
        - Speculation about external libraries

        Only report bugs that are directly supported by the code diff.

        Do not speculate.

        Do not invent potential issues.

        If the diff does not contain enough evidence of a bug,
        return an empty bugs array.

        A dependency version change alone is NOT a bug unless
        the diff shows code that will break because of that change.

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