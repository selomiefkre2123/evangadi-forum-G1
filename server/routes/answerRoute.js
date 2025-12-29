const express = require("express");
const { getAnswers } = require("../controller/answerController");

const router = express.Router();

// GET all answers for a question
router.get("/:question_id", getAnswers);

module.exports = router;
