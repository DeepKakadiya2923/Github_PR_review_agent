export function reviewSynthesizer(
    bugReview,
    styleReview,
    testReview
) {
    return {
        summary: "Automated PR Review Generated",

        bugs: bugReview.bugs || [],

        styleIssues: styleReview.styleIssues || [],

        testSuggestions: testReview.testSuggestions || [],
    };
}