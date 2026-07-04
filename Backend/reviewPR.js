import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";
import { bugAgent } from "./agents/bugAgent.js";

dotenv.config();

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

async function reviewPR() {
    // Fetch changed files from PR
    // const files = await octokit.pulls.listFiles({
    //     owner: "expressjs",
    //     repo: "express",
    //     pull_number: 7353,
    // });

    // Build diff text for AI review
    // let diffText = "";

    // for (const file of files.data) {
    //     diffText += `
    //         File: ${file.filename}

    //         ${file.patch || "No patch available"}

    //         --------------------------------
    //         `;
    // }

    // console.log("\n===== PR DIFF =====\n");
    // console.log(diffText);
    let diffText = `
    File: auth.js

    - const user = await getUser(id);
    - return user.name;

    + const user = await getUser(id);
    + return user.profile.name;
    `;

    try {
        // Send diff to Bug Agent
        const bugReview = await bugAgent(diffText);

        console.log("\n===== BUG REVIEW =====\n");
        console.log(bugReview);
    } catch (error) {
        console.error("Bug Agent Failed:");
        console.error(error.message);
    }
}

reviewPR();