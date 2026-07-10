import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";

import { bugAgent } from "./agents/bugAgent.js";
import { styleAgent } from "./agents/styleAgent.js";
import { testAgent } from "./agents/testAgent.js";
import { documentationAgent } from "./agents/documentationAgent.js";
import { reviewSynthesizer } from "./agents/reviewSynthesizer.js";

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

function cleanJsonResponse(data) {
  if (typeof data === "object") {
    return data;
  }

  return JSON.parse(
    data
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()
  );
}

export async function reviewPR(owner, repo, pullNumber) {
  const pr = await octokit.pulls.get({
    owner,
    repo,
    pull_number: pullNumber,
  });

  const metadata = {
    repository: repo,
    title: pr.data.title,
    author: pr.data.user.login,
    filesChanged: pr.data.changed_files,
    additions: pr.data.additions,
    deletions: pr.data.deletions,
  };

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
    if (diffText.length > 12000) {
      diffText = diffText.slice(0, 12000);
    } 

  const [bugReviewRaw,styleReviewRaw,testReviewRaw,documentationReviewRaw,] = await Promise.all([bugAgent(diffText),styleAgent(diffText),testAgent(diffText),documentationAgent(diffText),]);

  console.log("BUG RAW:", bugReviewRaw);
  console.log("STYLE RAW:", styleReviewRaw);
  console.log("TEST RAW:", testReviewRaw);
  console.log("DOCUMENTATION RAW:", documentationReviewRaw);

  const bugReview = cleanJsonResponse(bugReviewRaw);
  const styleReview = cleanJsonResponse(styleReviewRaw);
  const testReview = cleanJsonResponse(testReviewRaw);
  const documentationReview = cleanJsonResponse(documentationReviewRaw);

  const review = reviewSynthesizer(
    bugReview,
    styleReview,
    testReview,
    documentationReview
  );

  return {
    metadata,
    ...review,
  };
  
}