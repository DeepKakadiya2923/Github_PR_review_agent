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

export async function reviewPR(owner, repo, pullNumber) {
  const files = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number: pullNumber,
  });

  let diffText = "";

  for (const file of files.data) {
    diffText += `
        File: ${file.filename}

        ${file.patch || "No patch available"}

        --------------------------------
        `;
    }

  const bugReviewRaw = await bugAgent(diffText);
  const styleReviewRaw = await styleAgent(diffText);
  const testReviewRaw = await testAgent(diffText);

  console.log("BUG RAW:", bugReviewRaw);
  console.log("STYLE RAW:", styleReviewRaw);
  console.log("TEST RAW:", testReviewRaw);
  const bugReview = JSON.parse(bugReviewRaw);
  const styleReview = JSON.parse(styleReviewRaw);
  const testReview = JSON.parse(testReviewRaw);

  return reviewSynthesizer(
    bugReview,
    styleReview,
    testReview
  );
}