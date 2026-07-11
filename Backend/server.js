import express from "express";
import cors from "cors";

import { postComment } from "./commentService.js";
import { parsePRUrl } from "./utils/parsePRUrl.js";
import { reviewPR } from "./reviewPRService.js";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/review", async (req, res) => {
  try {
    const { prUrl } = req.body;

    const {
      owner,
      repo,
      pullNumber,
    } = parsePRUrl(prUrl);

    const review = await reviewPR(
      owner,
      repo,
      pullNumber
    );

    res.json(review);

  } catch (error) {
    console.error(error);

    if(error.message.includes("429") || error.message.includes("RESOURCE_EXHAUSTED")) {
        return res.status(429).json({ error: "Gemini API quota exceeded. Please try again later.", });
    }
    

    if (error.message?.includes("503") || error.message?.includes("UNAVAILABLE")) {
      return res.status(503).json({error: "Gemini service is busy. Please try again later.",});
    }
    
    res.status(500).json({
        error: error.message,
    });
}
});

app.post("/comment", async (req, res) => {
  try {
    const { prUrl, comment } = req.body;

    const {
      owner,
      repo,
      pullNumber,
    } = parsePRUrl(prUrl);

    const commentUrl = await postComment(
      owner,
      repo,
      pullNumber,
      comment
    );

    res.json({
      success: true,
      commentUrl,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});