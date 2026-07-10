export function reviewSynthesizer(
    bugReview,
    styleReview,
    testReview,
    documentationReview
) {
    return {
        summary: "Automated PR Review Generated",

        bugs: bugReview.bugs || [],

        styleIssues: styleReview.styleIssues || [],

        testSuggestions: testReview.testSuggestions || [],

        documentationIssues:documentationReview.documentationIssues || [],
    };
}