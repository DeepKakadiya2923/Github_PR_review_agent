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

function cleanJsonResponse(text) {
    return text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
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

  // const bugReviewRaw = await bugAgent(diffText);
  // const styleReviewRaw = await styleAgent(diffText);
  // const testReviewRaw = await testAgent(diffText);

  // console.log("BUG RAW:", bugReviewRaw);
  // console.log("STYLE RAW:", styleReviewRaw);
  // console.log("TEST RAW:", testReviewRaw);

  // const bugReview = JSON.parse(cleanJsonResponse(bugReviewRaw));
  // const styleReview = JSON.parse(cleanJsonResponse(styleReviewRaw));
  // const testReview = JSON.parse(cleanJsonResponse(testReviewRaw));

  // const review = reviewSynthesizer(
  //   bugReview,
  //   styleReview,
  //   testReview
  // );

  // return {
  //   metadata,
  //   ...review,
  // };
  return {
  metadata,
  summary: "Test Summary",
  bugs: [],
  styleIssues: [],
  testSuggestions: [],
};
}