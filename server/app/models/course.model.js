const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  subject: { type: String },
  chapters: [
    {
      title: { type: String },
      topics: [
        {
          title: { type: String },
          videoUrl: { type: String },
          summary: { type: String },
          conceptChecks: [
            {
              question: { type: String },
              answer: { type: String },
              options: [String],
            },
          ],
          completed: { type: Boolean, default: false },
          userResults: {
            score: { type: Number, default: 0 },
            completedAt: { type: Date },
          },
        },
      ],
    },
  ],
  enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: String, enum: ["user", "ai"], default: "ai" },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
