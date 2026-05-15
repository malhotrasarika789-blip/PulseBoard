import Poll from "../models/Poll.js";

// CREATE POLL
export const createPoll = async (req, res) => {
  try {
    const { title, description, questions, allowAnonymous, expiresAt } = req.body;

    const poll = await Poll.create({
      title,
      description,
      questions,
      allowAnonymous,
      expiresAt,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Poll created successfully",
      poll,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL POLLS
export const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find().populate("createdBy", "name email");
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE POLL
export const getSinglePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }
    res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE POLL
export const deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }
    await poll.deleteOne();
    res.status(200).json({ message: "Poll deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VOTE POLL
// 🔥 FIXED CRITICAL: Pura logic update kar diya database commit aur calculation matching ke sath
export const votePoll = async (req, res) => {
  try {
    const { answers } = req.body; // Frontend sends: { "0": "Node.js + Redis PubSub" }
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Loop through each question in the poll schema
    poll.questions.forEach((q, qIndex) => {
      const selectedOptionText = answers[qIndex]; // The option text user clicked

      if (selectedOptionText) {
        // Find option inside document (checks text subproperty or string array element)
        const targetOption = q.options.find(
          (opt) => (typeof opt === "object" ? opt.text : opt) === selectedOptionText
        );

        if (targetOption) {
          // If options are objects, increment vote tracker
          if (typeof targetOption === "object" && targetOption.votes !== undefined) {
            targetOption.votes += 1;
          }
        }

        // Push response structure array log inside document to keep counts alive for analytics
        if (!q.responses) {
          q.responses = [];
        }
        q.responses.push({
          user: req.user ? req.user.id : null,
          votedAt: new Date(),
        });
      }
    });

    // Mark modifications and save the state in MongoDB Atlas
    poll.markModified("questions");
    await poll.save();

    res.status(200).json({
      message: "Vote submitted successfully",
      poll,
    });
  } catch (error) {
    console.error("Vote Engine Error Details:", error.message);
    res.status(500).json({ message: error.message });
  }
};