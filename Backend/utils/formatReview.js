export function formatReview(review) {
    let markdown = `# 🤖 AI PR Review\n\n`;

    markdown += `## Summary\n`;
    markdown += `${review.summary}\n\n`;

    markdown += `## 🐛 Bugs\n`;

    if (review.bugs.length === 0) {
        markdown += `No bugs found.\n\n`;
    } else {
        review.bugs.forEach((bug) => {
            markdown += `### ${bug.title}\n`;
            markdown += `- Severity: ${bug.severity}\n`;
            markdown += `- Description: ${bug.description}\n`;
            markdown += `- Recommendation: ${bug.recommendation}\n\n`;
        });
    }

    markdown += `## 🎨 Style Issues\n`;

    if (review.styleIssues.length === 0) {
        markdown += `No style issues found.\n\n`;
    } else {
        review.styleIssues.forEach((issue) => {
            markdown += `### ${issue.title}\n`;
            markdown += `- Severity: ${issue.severity}\n`;
            markdown += `- Description: ${issue.description}\n`;
            markdown += `- Recommendation: ${issue.recommendation}\n\n`;
        });
    }

    markdown += `## ✅ Test Suggestions\n`;

    if (review.testSuggestions.length === 0) {
        markdown += `No test suggestions.\n\n`;
    } else {
        review.testSuggestions.forEach((test) => {
            markdown += `- **${test.title}** (${test.priority})\n`;
            markdown += `  - ${test.description}\n`;
        });
    }

    return markdown;
}