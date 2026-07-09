import { useState } from "react";

function PRForm() {
  const [prUrl, setPrUrl] = useState("");
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [posting, setPosting] = useState(false);

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

      alert("Review posted successfully!");

    } catch (error) {
      alert(error.message);
    } finally {
      setPosting(false);
    }
  };

  // console.log(review.testSuggestions);
  if (review) {
  console.log("Review Data:", review);

  console.log("First Bug:", review.bugs?.[0]);

  console.log(
    "First Style Issue:",
    review.styleIssues?.[0]
  );

  console.log(
    "First Test Suggestion:",
    review.testSuggestions?.[0]
  );
}
  return (
    <div>
      <input
        type="text"
        placeholder="Paste GitHub PR URL"
        value={prUrl}
        onChange={(e) => setPrUrl(e.target.value)}
      />

      <button onClick={handleReview} disabled={loading}>
        {loading ? "Reviewing..." : "Review PR"}
      </button>

      {review && (
        <button
          onClick={handlePostReview}
          disabled={posting}
        >
          {posting
            ? "Posting..."
            : "Post Review to GitHub"}
        </button>
      )}

      {error && (<p>{error}</p>)}
    
      {review &&
      (
        <div>
          {review?.metadata && (
          <div className="section-card">
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
          <div className="section-card">
            <h2>Summary</h2>
            <p>{review.summary}</p>
          </div>

          <div className="section-card">
            <h2>Bugs</h2>

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

          <div className="section-card">
            <h2>Style Issues</h2>

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

          <div className="section-card">
            <h2>Test Suggestions</h2>

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
    </div>
  );
}

export default PRForm;