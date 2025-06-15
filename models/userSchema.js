

const mongoose = require("mongoose");
const judge = require("validator");
const encrypt = require("bcrypt");

const userScm = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "please put in your name"],
    },

    last_name: {
        type: String,
        required: [true, "please put in your name"],
    },

    username: {
        type: String,
        required: [true, "please use a unique handle"],
        unique: true,
    },

    email: {
        type: String,
        required: [true, "email is necessary"],
        unique: true,
        validate: [judge.isEmail, "please us a valid email"],
    },

    password:{
        type: String,
        required: true,
        minlength: [6, "should be more than 6"],
    },

});

userScm.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await encrypt.genSalt();
    this.password = await encrypt.hash(this.password, salt);
    next();
});

const USER = new mongoose.model("USER", userScm);

module.exports = USER;