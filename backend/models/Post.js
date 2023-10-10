const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
const postSchema = new Schema({
  id: String,
  gated: Boolean,
  url: String,
  picture: String,
  name: String,
  description: String,
  nftContract: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});
 
module.exports = mongoose.model("Post", postSchema);