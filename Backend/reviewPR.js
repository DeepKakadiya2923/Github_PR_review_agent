import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function reviewPR() {
    const files = await octokit.pulls.listFiles({
        owner: "expressjs",
        repo: "express",
        pull_number: 7353,
    });

    let diffText = "";
    for (const file of files.data) {
        diffText += `File: ${file.filename} ${file.patch || "No patch available"}`;
    }

    console.log("Patch:");
    console.log(diffText);

    const prompt = `
        You are a senior software engineer.

        Review the following pull request.

        ${diffText}

        Find:
        1. Bugs
        2. Security Issues
        3. Performance Issues
        4. Code Quality Issues

        Return structured feedback.
        `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    console.log("\nAI Review:\n");
    console.log(response.text);
}

reviewPR();