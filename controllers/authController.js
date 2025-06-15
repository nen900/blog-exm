

const USER = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const encrypt = require("bcrypt");
const judge = require("validator");

const createUser = async (req, res) => {
    try{

        const {first_name, last_name, username, password, email} = req.body;
        console.log("SIGN UO PAYLOAD:", req.body);

        const existinguser = await USER.findOne({email: req.body.email});
            if (existinguser) {
                return res.status(409).json({errors: {email: "this email areasy exists"}});
            }

        const usedAT = await USER.findOne({username: req.body.username});
             if (usedAT) {
                return res.status(409).json({errors: {username: "this username areasy exists"}});
            }

         if (!judge.isEmail(email)) {
            return res.status(400).json({ message: "Not a valid email, please recheck." });
        }

        const aUser = await USER.create({
             first_name,
             last_name,
             username,
             email,
             password,
});

        const token = jwt.sign({
            id: aUser._id, 
            email: aUser.email}, 
            process.env.JWT_KEY, {
                 expiresIn: "1h",
        });

        return res.status(201).json({
            user: {
                id: aUser._id,
                email: aUser.email,
                username: aUser.username,
                },
                token,
            })
    } catch(error){
        console.log("SIGNUP ERROR:", error); 
        return res.status(500).json({message: "signup failed, please try again"});
}

};

const loginUser = async(req, res) => {
    const{username, password} = req.body;
    try{
        const aUser = await USER.findOne({username});

        if (aUser){
            const checkPassword = await encrypt.compare(password, aUser.password);

            if (checkPassword){
                const token = jwt.sign({
                    id: aUser._id, 
                    username: aUser.username}, 
                    process.env.JWT_KEY, 
                         {expiresIn: "1h"}
                    );
                
                    
                 return res.status(201).json({
                    user: {
                    id: aUser._id,
                    username: aUser.username,
                   
                    },
                    token,
            });
            } else {
                return res.status(400).json({message: "incorect password"})
            }
        } else {
            return res.status(400).json({message: "no qccount with that username"});
        }
    } catch(error){
        console.error("login rreor:", error)
        return res.status(500).json({message: "login failed please"});
    }
};

module.exports = {createUser, loginUser};

