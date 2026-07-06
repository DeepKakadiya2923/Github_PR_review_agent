import { Octokit } from "@octokit/rest";

export async function postReviewComment(
    owner,
    repo,
    pullNumber,
    commentBody
) {
    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    await octokit.issues.createComment({
        owner,
        repo,
        issue_number: pullNumber,
        body: commentBody,
    });
}