import express from "express";
import cors from "cors";

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
    res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});