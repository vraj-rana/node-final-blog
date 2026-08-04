const Article = require("../models/Article");
const User = require("../models/User");


const getAllArticles = async (req, res) => {
    try {

        const articles = await Article.find()
            .populate("author")
            .populate({
                path: "comments",
                populate: {
                    path: "user"
                }
            })
            .sort({ createdAt: -1 });

        res.render("articles/articleList",{
    articles
});

    } catch (error) {
        console.log(error);
        res.send("Error Fetching Articles");
    }
};


const articleForm = (req, res) => {

    res.render("articles/articleForm");

};


const createArticle = async (req, res) => {

    try {

        const { title, content } = req.body;

        const article = await Article.create({
            title,
            content,
            author: req.user.id
        });

        await User.findByIdAndUpdate(req.user.id, {
            $push: {
                articles: article._id
            }
        });

        res.redirect("/articles");

    } catch (error) {

        console.log(error);

        res.send("Unable To Create Article");

    }

};


const myArticles = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).populate({
            path: "articles",
            populate: [
                { path: "author" },
                {
                    path: "comments",
                    populate: { path: "user" }
                }
            ]
        });

        const articles = user ? user.articles : [];

        res.render("articles/myArticles", {
            articles
        });

    } catch (error) {

        console.log(error);

        res.send("Error Fetching My Articles");

    }

};


const editArticlePage = async (req, res) => {

    try {

        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.send("Article Not Found");
        }

        if (
            article.author.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.send("Access Denied");
        }

        res.render("articles/editArticle", {
            article
        });

    } catch (error) {

        console.log(error);

        res.send("Error");

    }

};


const updateArticle = async (req, res) => {

    try {

        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.send("Article Not Found");
        }

        if (
            article.author.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.send("Access Denied");
        }

        article.title = req.body.title;
        article.content = req.body.content;

        await article.save();

        res.redirect("/articles");

    } catch (error) {

        console.log(error);

        res.send("Error");

    }

};


const deleteArticle = async (req, res) => {

    try {

        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.send("Article Not Found");
        }

        if (
            article.author.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.send("Access Denied");
        }

        await User.findByIdAndUpdate(article.author, {
            $pull: {
                articles: article._id
            }
        });

        await Article.findByIdAndDelete(req.params.id);

        res.redirect("/articles");

    } catch (error) {

        console.log(error);

        res.send("Error");

    }

};

const adminDashboard = async (req, res) => {
    try {
        const articles = await Article.find().populate("author").sort({ createdAt: -1 });
        const users = await User.find().populate("articles");
        res.render("articles/adminDashboard", {
            articles,
            users
        });
    } catch (error) {
        console.log(error);
        res.send("Error Loading Admin Dashboard");
    }
};

module.exports = {

    getAllArticles,

    articleForm,

    createArticle,

    myArticles,

    editArticlePage,

    updateArticle,

    deleteArticle,

    adminDashboard

};