const Comment = require("../models/Comment");
const Article = require("../models/Article");


const addComment = async (req, res) => {

    try {

        const { comment } = req.body;

        const article = await Article.findById(req.params.articleId);

        if (!article) {
            return res.send("Article Not Found");
        }

        const newComment = await Comment.create({
            comment,
            user: req.user.id,
            article: article._id
        });

        article.comments.push(newComment._id);

        await article.save();

        res.redirect(req.headers.referer || "/articles");

    } catch (error) {

        console.log(error);

        res.send("Unable To Add Comment");

    }

};


const deleteComment = async (req, res) => {

    try {

        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.send("Comment Not Found");
        }

        if (
            comment.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.send("Access Denied");
        }

        await Article.findByIdAndUpdate(comment.article, {
            $pull: {
                comments: comment._id
            }
        });

        await Comment.findByIdAndDelete(comment._id);

        res.redirect(req.headers.referer || "/articles");

    } catch (error) {

        console.log(error);

        res.send("Unable To Delete Comment");

    }

};

module.exports = {
    addComment,
    deleteComment
};