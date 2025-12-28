const dbConnection = require("../db/dbConfig");
const statusCodes = require("http-status-codes");

// ================= GET ANSWERS FOR A QUESTION =================
async function getAnswers(req, res) {
  const { question_id } = req.params;

  // 1️⃣ Validate question_id
  if (!question_id || isNaN(question_id)) {
    return res
      .status(statusCodes.BAD_REQUEST)
      .json({ msg: "Invalid question_id" });
  }

  try {
    // 2️⃣ Fetch answers from DB
    const [answers] = await dbConnection.query(
      `SELECT 
         a.answerId, 
         a.answer, 
         a.answeredAt, 
         u.userId, 
         u.username 
       FROM answers a
       JOIN users u ON a.userId = u.userId
       WHERE a.questionId = ?
       ORDER BY a.answeredAt ASC`,
      [question_id]
    );

    // 3️⃣ If no answers found
    if (answers.length === 0) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ msg: "No answers found for this question" });
    }

    // 4️⃣ Send response
    return res.status(statusCodes.OK).json({
      questionId: parseInt(question_id),
      totalAnswers: answers.length,
      answers,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later" });
  }
}

module.exports = { getAnswers };
