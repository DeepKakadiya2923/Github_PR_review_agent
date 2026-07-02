import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function getPR() {
  try {
        const files = await octokit.pulls.listFiles({
        owner: "expressjs",
        repo: "express",
        pull_number: 7353,
        });
        console.log("Filename:", files.data[0].filename);
        console.log("Status:", files.data[0].status);
        console.log("Additions:", files.data[0].additions);
        console.log("Deletions:", files.data[0].deletions);
        console.log("Patch:", files.data[0].patch);
  } catch (error) {
    console.error(error.message);
  }
}

getPR();