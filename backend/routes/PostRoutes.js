const express = require("express");
const {
    getAllPosts,
    getAllPublicPosts,
    getAllPublicPostsById,
    getAllGatedPosts,
    getAllGatedPostsById,
    createPost,
    getPostById,
    updatePost,
    deletePost,
} = require("../controllers/PostController");
 
const router = express.Router();
 
router.route("/").get(getAllPosts).post(createPost);
router.route("/public").get(getAllPublicPosts)
router.route("/public/:id").get(getAllPublicPostsById)
router.route("/gated").get(getAllGatedPosts)
router.route("/gated/:id").get(getAllGatedPostsById)
router.route("/:id").get(getPostById).put(updatePost).delete(deletePost);
 
module.exports = router;