import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function securityAgent(diffText) {
  const prompt = `
        You are a Senior Application Security Engineer performing a professional security review of a GitHub Pull Request.

        Analyze ONLY the code changes present in the PR diff.

        Your task is to identify security vulnerabilities, insecure coding practices, credential leaks, authentication weaknesses, authorization flaws, and sensitive data exposure.

        Carefully inspect the diff for:

        1. Hardcoded Credentials
        - Passwords
        - API Keys
        - JWT Secrets
        - Access Tokens
        - OAuth Secrets
        - Database Credentials
        - Private Keys

        Examples:
        const password = "123456";
        const API_KEY = "abcdef";
        const JWT_SECRET = "supersecret";

        These MUST be reported even if they appear in:
        - test files
        - demo code
        - example code
        - temporary code
        - development code

        2. Injection Vulnerabilities
        - SQL Injection
        - NoSQL Injection
        - Command Injection
        - Code Injection
        - Unsafe eval()

        3. Authentication Issues
        - Missing authentication
        - Weak authentication logic
        - Hardcoded users
        - Authentication bypasses

        4. Authorization Issues
        - Missing authorization checks
        - Privilege escalation risks
        - Broken access control

        5. Input Validation Problems
        - Unsanitized user input
        - Missing validation
        - Unsafe file uploads

        6. Cross-Site Scripting (XSS)
        - Reflected XSS
        - Stored XSS
        - DOM-based XSS

        7. Sensitive Data Exposure
        - Logging passwords
        - Logging tokens
        - Logging secrets
        - Exposing confidential information

        8. Cryptographic Weaknesses
        - Weak hashing
        - Plaintext password storage
        - Insecure encryption

        9. Network Security Issues
        - HTTP instead of HTTPS
        - Disabled certificate validation
        - Insecure external requests

        10. Dependency & Configuration Risks
        - Security-sensitive configuration mistakes
        - Dangerous environment settings

        For every issue found, provide:

        {
        "title": "",
        "description": "",
        "severity": "Low|Medium|High|Critical",
        "recommendation": ""
        }

        Severity Guidelines:
        - Critical: Credential leaks, auth bypasses, RCE, SQL Injection
        - High: Hardcoded secrets, XSS, sensitive data exposure
        - Medium: Missing validation, weak security practices
        - Low: Minor security concerns

        IMPORTANT:
        - Do not report style issues.
        - Do not report performance issues.
        - Do not report documentation issues.
        - Only report genuine security concerns.

        Return ONLY valid JSON.

        {
        "securityIssues": [
            {
            "title": "",
            "description": "",
            "severity": "",
            "recommendation": ""
            }
        ]
        }

        If no issues exist:

        {
        "securityIssues": []
        }

        PR Diff:

        ${diffText}
        `;

    const response =
        await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        });

    return response.text.trim();
}