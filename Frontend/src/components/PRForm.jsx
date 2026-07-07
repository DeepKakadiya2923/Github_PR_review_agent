import { useState } from "react";

function PRForm() {
  const [prUrl, setPrUrl] = useState("");
  const [review, setReview] = useState(null);

  const handleReview = async () => {
    try {
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

      console.log(data);

      setReview(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Paste GitHub PR URL"
        value={prUrl}
        onChange={(e) => setPrUrl(e.target.value)}
      />

      <button onClick={handleReview}>
        Review PR
      </button>

      {review &&
      (
        <div>
        <h2>Summary</h2>
        <p>{review.summary}</p>

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

        <h2>Test Suggestions</h2>

        {review.testSuggestions.length === 0 ?
            (<p>No test suggestions.</p>): 
            (
                review.testSuggestions.map((test, index) => (
                    <div key={index}>
                    <p>{test}</p>
                    </div>
                ))
            )
        }
        </div>
        )
    }
    </div>
  );
}

export default PRForm;