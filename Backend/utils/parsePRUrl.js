export function parsePRUrl(prUrl) {
  const match = prUrl.match(
    /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/
  );

  if (!match) {
    throw new Error("Invalid GitHub PR URL");
  }

  return {
    owner: match[1],
    repo: match[2],
    pullNumber: Number(match[3]),
  };
}