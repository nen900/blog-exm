

const express = require("express");
const router = express.Router();
const authenticateusr = require("../middleware/auths.js");
const { createArticle, pubArticle, delArticle, editArticle, oneArticle } = require("../controllers/blogController");
const BLOG = require("../models/articleSchema.js")

//log in & create a n article psot
router.post("/articles", authenticateusr, createArticle);

// show all pub articles (no login) homepage (/)
router.get("/homepage", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const { title, author, tags } = req.query;
        const using = { articleState: "published" };

        if (title) {
            using.title = { $regex: title, $options: "i" };
        }

        if (tags) {
            using.tags = { $regex: tags, $options: "i" };
        }

        if (author) {
           using.author = author; 
        }
    

        const allArticles = await BLOG.find(using)
            .skip(skip)
            .limit(limit);

        const totalArticles = await BLOG.countDocuments(using);
        const totalpages = Math.ceil(totalArticles / limit);

         console.log("Showing all filtered/paginated published articles");
        return res.status(200).json({
            page,
            totalpages,
            totalArticles,
            allArticles,
        });

    } catch (err) {
        return res.status(500).json({
            message: "Sorry, failed to show all articles",
            error: err.message,
        });
    }
});

//for only users airticles
router.get("/myarticles", authenticateusr, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const userID = req.user.id;

        const listUserArticles = await BLOG.find({ author: userID })
            .skip(skip)
            .limit(limit);

        const totalUserArticles = await BLOG.countDocuments({ author: userID });
        const usertotalpages = Math.ceil(totalUserArticles / limit);

        console.log("Showing all user articles");
        return res.status(200).json({
            page,
            usertotalpages,
            totalUserArticles,
            listUserArticles,
        });
        

    } catch (err) {
        return res.status(500).json({ message: "Sorry, couldn't get your articles", error: err.message });
    }
});

//publidh artucles (from drafts)
router.patch("/article/:id", authenticateusr, pubArticle);

//deleting an article
router.delete("/article/:id", authenticateusr, delArticle);

///edit an article
router.patch("/article/:id/edit", authenticateusr, editArticle )

//get only one article
router.get("/article/:id", oneArticle);

module.exports = router;
