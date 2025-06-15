const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const blogRoute = require("./routes/blog");

const app = express();
const db = process.env.mongodb_url;
const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(blogRoute);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found", path: req.path });
});


if (process.env.NODE_ENV !== "test") {
  mongoose.connect(db)
    .then(() => {
      console.log("mongodb connected succesfully");
      app.listen(port, () => {
        console.log(`server is at localhost:${port}`);
      });
    })
    .catch((err) => {
      console.log("failed to connect mongodb", err);
    });
}

module.exports = app;
