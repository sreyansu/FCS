import mongoose from "mongoose"

const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
})

const FeedbackSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [AnswerSchema],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Ensure one feedback per user per form
FeedbackSchema.index({ formId: 1, userId: 1 }, { unique: true })

export default mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema)
