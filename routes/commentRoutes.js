const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/:articleId", authMiddleware, commentController.addComment);

router.delete("/:id", authMiddleware, commentController.deleteComment);

module.exports = router;