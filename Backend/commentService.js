import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function postComment(
  owner,
  repo,
  pullNumber,
  comment
) {
  const response = await octokit.issues.createComment({
    owner,
    repo,
    issue_number: pullNumber,
    body: comment,
  });

  return response.data.html_url;
}