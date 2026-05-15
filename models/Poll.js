import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
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
});

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    questions: [questionSchema],

    allowAnonymous: {
      type: Boolean,
      default: true,
    },

    expiresAt: {
      type: Date,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Poll", pollSchema);