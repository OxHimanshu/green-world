const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
const profileSchema = new Schema({
  _id: String,
  picture: String,
  description: String,
  name: String,
  contentCost: String,
  nftContract: String,
  nftArtIpfs: String,
  maxSupply: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});
 
module.exports = mongoose.model("Profile", profileSchema);