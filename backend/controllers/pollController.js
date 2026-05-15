import Poll from "../models/Poll.js";

// CREATE POLL
export const createPoll = async (req, res) => {
  try {
    const { title, description, questions, allowAnonymous, expiresAt } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Login required to create a poll." });
    }

    // Backend validation to match your Frontend 'question' key
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "At least one question is required." });
    }

    const poll = await Poll.create({
      title: title || "New Poll",
      description,
      questions,
      allowAnonymous: allowAnonymous || false,
      expiresAt,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Poll published successfully", poll });
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
    if (!poll) return res.status(404).json({ message: "Poll not found" });
    res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE POLL
export const deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    if (poll.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized delete request." });
    }

    await poll.deleteOne();
    res.status(200).json({ message: "Poll deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VOTE POLL (The Fixed Logic)
export const votePoll = async (req, res) => {
  try {
    const { answers } = req.body; 
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Loop through the questions in the poll
    poll.questions.forEach((q, qIndex) => {
      const selectedOptionText = answers[qIndex]; 

      if (selectedOptionText) {
        // Find the matching option by comparing strings
        const targetOption = q.options.find(opt => 
          (typeof opt === 'string' ? opt : opt.text) === selectedOptionText
        );

        if (targetOption) {
          // If options are objects with votes field
          if (typeof targetOption === 'object') {
            targetOption.votes = (targetOption.votes || 0) + 1;
          } else {
            // If options are just strings in schema, you might need a different schema structure
            // But usually, in our setup, they are objects.
            console.log("Option found but is a simple string:", targetOption);
          }
        }

        // Add response metadata
        if (!q.responses) q.responses = [];
        q.responses.push({
          user: req.user ? req.user.id : null,
          votedAt: new Date(),
        });
      }
    });

    // CRITICAL: This is why votes weren't saving!
    poll.markModified("questions"); 
    
    await poll.save();

    res.status(200).json({ message: "Vote recorded successfully", poll });
  } catch (error) {
    console.error("VOTE ERROR:", error.message);
    res.status(500).json({ message: "Voting Error: " + error.message });
  }
};