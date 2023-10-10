const postService = require("../services/PostService");
 
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.json({ data: posts, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPublicPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPublicPosts();
    res.json({ data: posts, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPublicPostsById = async (req, res) => {
  try {
    const posts = await postService.getAllPublicPostsById(req.params.id);
    res.json({ data: posts, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.getAllGatedPosts = async (req, res) => {
  try {
    const posts = await postService.getAllGatedPosts();
    res.json({ data: posts, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.getAllGatedPostsById = async (req, res) => {
  try {
    const posts = await postService.getAllGatedPostsById(req.params.id);
    res.json({ data: posts, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const post = await postService.createPost(req.body);
    res.json({ data: post, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.getPostById = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    res.json({ data: post, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.updatePost = async (req, res) => {
  try {
    const post = await postService.updatePost(req.params.id, req.body);
    res.json({ data: post, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.deletePost = async (req, res) => {
  try {
    const post = await postService.deletePost(req.params.id);
    res.json({ data: post, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};