import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";
import { bugAgent } from "./agents/bugAgent.js";
import { styleAgent } from "./agents/styleAgent.js";
import { testAgent } from "./agents/testAgent.js";
import { reviewSynthesizer } from "./agents/reviewSynthesizer.js";

dotenv.config();

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

async function reviewPR() {
    // Fetch changed files from PR
    const files = await octokit.pulls.listFiles({
        owner: "expressjs",
        repo: "express",
        pull_number: 7353,
    });

    // Build diff text for AI review
    let diffText = "";

    for (const file of files.data) {
        diffText += `
            File: ${file.filename}

            ${file.patch || "No patch available"}

            --------------------------------
            `;
    }

    console.log("\n===== PR DIFF =====\n");
    console.log(diffText);
    

    try {
        const bugReviewRaw = await bugAgent(diffText);
        const styleReviewRaw = await styleAgent(diffText);
        const testReviewRaw = await testAgent(diffText);
        
        const bugReview = JSON.parse(bugReviewRaw);
        const styleReview = JSON.parse(styleReviewRaw);
        const testReview = JSON.parse(testReviewRaw);

        const finalReview = reviewSynthesizer(
            bugReview,
            styleReview,
            testReview
        );

        console.log("\n===== FINAL REVIEW =====\n");
        console.log(JSON.stringify(finalReview, null, 2));
    } catch (error) {
        console.error("Bug Agent Failed:");
        console.error(error.message);
    }
}

reviewPR();