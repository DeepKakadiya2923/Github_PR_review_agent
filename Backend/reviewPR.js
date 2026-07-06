import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";
import { bugAgent } from "./agents/bugAgent.js";
import { styleAgent } from "./agents/styleAgent.js";
import { testAgent } from "./agents/testAgent.js";
import { reviewSynthesizer } from "./agents/reviewSynthesizer.js";
import { formatReview } from "./utils/formatReview.js";
import { postReviewComment } from "./utils/postReviewComment.js";

dotenv.config();

const owner = "expressjs";
const repo = "express";
const pullNumber = 7353;

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

async function reviewPR() {
    // Fetch changed files from PR
    const files = await octokit.pulls.listFiles({
        owner,
        repo,
        pull_number: pullNumber,
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

        const markdownReview = formatReview(finalReview);

        await postReviewComment(
            owner,
            repo,
            pullNumber,
            markdownReview
        );

        console.log("\n===== MARKDOWN REVIEW =====\n");
        console.log(markdownReview);
        console.log("\n✅ Review posted to GitHub PR");

        console.log("\n===== FINAL REVIEW =====\n");
        console.log(JSON.stringify(finalReview, null, 2));

    } catch (error) {
        console.error("Review Failed:");
        console.error(error.message);
    }
}

reviewPR();