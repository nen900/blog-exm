
const jwt = require("jsonwebtoken");

const authenticateusr = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", ""); 

    if (!token) {
        return res.status(401).json({ message: "Unauthorized. No token provided." });
    }
     
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = { id: decoded.id };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

module.exports = authenticateusr;
