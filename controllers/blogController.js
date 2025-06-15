

const BLOG = require("../models/articleSchema");

function estimatedReadingTime(body) {
    const WPM = 200;
    const wordcount = body.trim().split(/\s+/).length;
    const time = Math.ceil(wordcount / WPM);
    
    return `A ${time} min(s) read`;
}

const createArticle = async (req, res) => {
    try {
        // const artilceID = req.params.id;
        const userID = req.user.id;

        const { title, description, body, tags } = req.body;

        const newArticle = await BLOG.create({
            title,
            description,
            articleBody: body,
            tags,
            author: req.user.id,
            reading_time: estimatedReadingTime(body),
            articleState: "draft",
        });

        return res.status(201).json({
            message: "Article created successfully",
            article_id: newArticle._id,
            article: newArticle,
});
    } catch (err) {
       return  res.status(500).json({message: "sorry artilce wasnt creayed", error: err.message});
    }
};

const pubArticle = async (req, res) => {
    try {
        const artilceID = req.params.id;
        const userID = req.user.id;

        const article = await BLOG.findById(artilceID);

        if (!article) {
            return res.status(404).json({message: "couldnt find artilce"});
        }

        if (article.author.toString() !== userID) {
            return res.status(403).json({ message: "Unauthorized to publish this article" });
        }

        if (article.articleState === "published") {
            return res.status(400).json({ message: "articel is already published" });
        }

        article.articleState = "published";
        await article.save();

       return res.status(200).json({
            message: "Article published successfully",
            article_id: article._id,
            articleTitle: article.title,
            articleState: article.articleState,
});
    } catch (err) {
        return res.status(500).json({ message: "Failed to publish Article", error: err.message });
    }
        
};

const delArticle = async (req, res) => {
    try {
        const artilceID = req.params.id;
        const userID = req.user.id;

         const article = await BLOG.findById(artilceID);

         if (!article) {
            return res.status(404).json({message: "couldnt find artilce (already deleted?) "});
        }

        if (article.author.toString() !== userID) {
            return res.status(403).json({ message: "Unauthorized to delete this article" });
        }

        await article.deleteOne();  

        console.log("article deleted succesfully");
        return res.status(200).json({ message: "Article deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Failed to delete Article", error: err.message });
    }
    
};

const editArticle = async (req, res) => {
    try {
        const articleID = req.params.id;
        const userID = req.user.id;

        const article = await BLOG.findById(articleID);

        if (!article) {
            return res.status(404).json({ message: "Sorry, couldn't find article" });
        }

        if (article.author.toString() !== userID) {
            return res.status(403).json({ message: "Unauthorized to edit this article" });
        }

        const { title, description, body, tags } = req.body;

        if (title) article.title = title;
        if (description) article.description = description;
        if (body) {
            article.articleBody = body;
            article.reading_time = estimatedReadingTime(body); 
        }
        if (tags) article.tags = tags;

        await article.save();

        console.log("something has ben edited in article");
        return res.status(200).json({
             message: "Article updated successfully", 
             article_id: articleID,
             articleTitle: article.title,
             articlebody: article.articleBody, });

    } catch (err) {
        return res.status(500).json({ message: "Failed to update article", error: err.message });
    }
};
 
const oneArticle = async (req, res) => {
    try {
        const articleID = req.params.id;

        const article = await BLOG.findOneAndUpdate(
            {_id: articleID, articleState: "published"},
            { $inc: { read_count: 1 } },
            {new: true}
        ).populate("author", "first_name last_name email");

        if (!article) {
            return res.status(404).json({message: "aitcel not found or still unpublushed"});
        }

        return res.status(200).json(article);
    } catch (err) {
        return res.status(500).json({ message: "couldnt fetch aitcle", error: err.message });
    }
};


module.exports = {
    createArticle,
    pubArticle,
    delArticle,
    editArticle,
    oneArticle,
}