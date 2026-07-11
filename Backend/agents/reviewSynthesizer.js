export function reviewSynthesizer(
    bugReview,
    styleReview,
    testReview,
    documentationReview,
    securityReview
) {
    return {
        summary: "Automated PR Review Generated",

        bugs: bugReview.bugs || [],

        styleIssues: styleReview.styleIssues || [],

        testSuggestions: testReview.testSuggestions || [],

        documentationIssues:documentationReview.documentationIssues || [],

        securityIssues: securityReview.securityIssues || [],
    };
}