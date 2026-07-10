import { useState } from "react";

function PRForm() {
  const [prUrl, setPrUrl] = useState("");
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [posting, setPosting] = useState(false);
  const [success, setSuccess] = useState("");

  const handleReview = async () => {
    try {
      setError("");
      setReview(null);
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/review",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prUrl,
          }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }

      console.log(data);
      console.log(data.testSuggestions);
      setReview(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handlePostReview = async () => {
    try {
      setPosting(true);

      const comment = `
          ## AI PR Review

          ### Summary
          ${review.summary}

          ### Bugs
          ${review.bugs.length === 0
            ? "No bugs found."
            : review.bugs.map((b) => `- ${b.title}: ${b.description}`).join("\n")
          }

          ### Style Issues
          ${review.styleIssues.length === 0
            ? "No style issues found."
            : review.styleIssues
                .map((s) => `- ${s.title}: ${s.description}`)
                .join("\n")
          }

         ### Test Suggestions
          ${
            review.testSuggestions.length === 0
              ? "No test suggestions."
              : review.testSuggestions
                  .map(
                    (t) =>
                      `- ${t.title}: ${t.description} (Priority: ${t.priority})`
                  )
                  .join("\n")
          }
          `;

    const response = await fetch(
      "http://localhost:5000/comment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prUrl,
          comment,
        }),
      }
    );

    const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setSuccess("Review posted to GitHub successfully!");

    } catch (error) {
      alert(error.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
        <p className="subtitle">
          AI-powered code review using Gemini
        </p>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2">
          Analyze Pull Request
        </h2>

        <p className="text-gray-600 mb-4">
          AI-powered code review using Gemini
        </p>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Paste GitHub PR URL"
            value={prUrl}
            onChange={(e) => setPrUrl(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleReview}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            {loading ? "Reviewing..." : "Review PR"}
          </button>
        </div>
      </div>

      {review && (
        <div className="button-section">
          <div className="mb-6">
            <button
              onClick={handlePostReview}
              disabled={posting}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {posting
                ? "Posting..."
                : "Post Review to GitHub"}
            </button>
          </div>
        </div>  
      )}

      {loading && (
        <p className="text-blue-600 font-semibold mb-4 animate-pulse">Analyzing Pull Request...</p>
      ) }

      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
        {error && <p>{error}</p>}
      </div>

      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
        {success && <p>{success}</p>}
      </div>
    
      {review &&
      (
        <div>
          {review?.metadata && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2>PR Information</h2>

              <p>
                <strong>Repository:</strong>{" "}
                {review.metadata.repository}
              </p>

              <p>
                <strong>Title:</strong>{" "}
                {review.metadata.title}
              </p>

              <p>
                <strong>Author:</strong>{" "}
                {review.metadata.author}
              </p>

              <p>
                <strong>Files Changed:</strong>{" "}
                {review.metadata.filesChanged}
              </p>

              <p>
                <strong>Additions:</strong>{" "}
                {review.metadata.additions}
              </p>

              <p>
                <strong>Deletions:</strong>{" "}
                {review.metadata.deletions}
              </p>
            </div>
          )}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-6 mb-6 shadow">
            <h2>Summary</h2>
            <p>{review.summary}</p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 mb-6 shadow">
            <h2>Bugs ({review.bugs.length})</h2>

            {review.bugs.length === 0 ? 
                (<p>No bugs found.</p>): 
                (
                    review.bugs.map((bug, index) => (
                        <div key={index}>
                        <h4>{bug.title}</h4>
                        <p>{bug.description}</p>
                        </div>
                    ))
                )
            }
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-6 mb-6 shadow">
            <h2>Style Issues ({review.styleIssues.length})</h2>

            {review.styleIssues.length === 0 ? 
                (<p>No style issues found.</p>): 
                (
                    review.styleIssues.map((issue, index) => (
                        <div key={index}>
                        <h4>{issue.title}</h4>
                        <p>{issue.description}</p>
                        </div>
                    ))
                )
            }
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-6 mb-6 shadow">
            <h2>Test Suggestions ({review.testSuggestions.length})</h2>

            {review.testSuggestions.length === 0 ? (
              <p>No test suggestions.</p>
            ) : (
              review.testSuggestions.map((test, index) => (
                <div key={index}>
                  <h4>{test.title}</h4>
                  <p>{test.description}</p>
                  <p>
                    <strong>Priority:</strong> {test.priority}
                  </p>
                </div>
              ))
            )}
          </div>
        
        </div>
        )
      }

      <footer className="text-center text-gray-500 mt-10 mb-4">
          Built with React, Node.js, Gemini AI and GitHub API
      </footer>

    </div>
  );
}

export default PRForm;