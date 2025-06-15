

const mongoose = require("mongoose");

const articleScm = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },


    description: {
        type: String,
        required: true,
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
        required: true,
    },

    articleState: {
        type: String,
        //type: enum["draft", "publushed"]
        enum: ["draft", "published"],
        default: "draft",
    },

    articleBody: {
        type: String,
        required: true,
        // unique: true,
    },

    tags: {
        type: [String],
    },
    
    read_count: {
        type: Number,
        default: 0,
    },

    reading_time: {
        type: String,
    },

}, {timestamps:true});

const BLOG = new mongoose.model("BLOG", articleScm);
module.exports = BLOG;