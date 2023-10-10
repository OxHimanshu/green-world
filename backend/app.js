require('dotenv').config();
let cors = require('cors')
const express = require("express");
const app = express();

const postRouter = require("./routes/PostRoutes");
const profileRouter = require("./routes/ProfileRoutes");

const mongoose = require("mongoose");
try {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/CRUD");
    console.log("Connected to Mongo Successfully!");
} catch (error) {
    console.log(error);
}

//middleware
app.use(cors())
app.use(express.json());
app.use("/api/posts", postRouter);
app.use("/api/profiles", profileRouter);
 
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
 
module.exports = app;
