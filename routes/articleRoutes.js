const express = require("express");
const router = express.Router();

const articleController = require("../controllers/articleController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, articleController.getAllArticles);

router.get("/admin", authMiddleware, roleMiddleware("admin"), articleController.adminDashboard);

router.get("/my", authMiddleware, articleController.myArticles);

router.get("/new", authMiddleware, articleController.articleForm);

router.post("/", authMiddleware, articleController.createArticle);

router.get("/edit/:id", authMiddleware, articleController.editArticlePage);

router.put("/:id", authMiddleware, articleController.updateArticle);

router.delete("/:id", authMiddleware, articleController.deleteArticle);

module.exports = router;