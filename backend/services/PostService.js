const PostModel = require("../models/Post");
const ProfileModel = require("../models/Profile");
 
exports.getAllPosts = async () => {
  return await PostModel.find();
};

exports.getAllPublicPosts = async () => {
  const posts =  await PostModel.find({gated: false}).sort({createdAt: -1});
  if(posts.length > 0) {
    for (var i = 0; i < posts.length; i++) {
      const profile = await ProfileModel.findById(posts[i]['id'])
      posts[i]['picture'] = profile['picture']
      posts[i]['name'] = profile['name']
      posts[i]['description'] = profile['description']
    }
  }
  return posts
};

exports.getAllPublicPostsById = async (id) => {
  return await PostModel.find({gated: false, id:id}).sort({createdAt: -1});
};

exports.getAllGatedPosts = async () => {
  return await PostModel.find({gated: true}).sort({createdAt: -1});
};

exports.getAllGatedPostsById = async (id) => {
  return await PostModel.find({gated: true, id:id}).sort({createdAt: -1});
};
 
exports.createPost = async (post) => {
  return await PostModel.create(post);
};
exports.getPostById = async (id) => {
  return await PostModel.findById(id);
};
 
exports.updatePost = async (id, post) => {
  return await PostModel.findByIdAndUpdate(id, post);
};
 
exports.deletePost = async (id) => {
  return await PostModel.findByIdAndDelete(id);
};