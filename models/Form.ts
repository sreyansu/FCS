import mongoose from "mongoose"

const QuestionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["text", "email", "textarea", "select", "radio", "checkbox", "rating"],
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
    },
  ],
  required: {
    type: Boolean,
    default: false,
  },
})

const FormSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    questions: [QuestionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    responseCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

FormSchema.virtual("status").get(function () {
  const now = new Date()
  if (now < this.startDate) return "upcoming"
  if (now > this.endDate) return "expired"
  return "active"
})

FormSchema.set("toJSON", { virtuals: true })
FormSchema.set("toObject", { virtuals: true })

export default mongoose.models.Form || mongoose.model("Form", FormSchema)
