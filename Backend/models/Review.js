import mongoose from "mongoose";

const reviewSchema =
  new mongoose.Schema(
    {
      repository: String,
      title: String,
      author: String,

      filesChanged: Number,
      additions: Number,
      deletions: Number,

      bugs: Array,
      styleIssues: Array,
      testSuggestions: Array,
      documentationIssues: Array,
      securityIssues: Array,
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Review",
  reviewSchema
);