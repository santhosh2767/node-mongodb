const express = require("express");
const { getPosts, getPost, createPost, updatePost, softDeletePost, restorePost, getPostWithLike, getPostWithComment,getPaginatedPosts } = require('../controllers/postController')
const postValidate = require("../middleware/postValidation");
const protect = require("../middleware/tokenValidation");
const pagination = require("../middleware/pagination");
const router = express.Router();

router.get("/posts", getPosts);
router.get("/post/:id", getPost);
router.get("/postwithlike/:id", getPostWithLike);
router.get("/postwithcomment/:id", getPostWithComment);
router.post("/createpost", protect, postValidate, createPost);
router.put("/updatepost/:id", protect, updatePost);
router.delete("/deletepost/:id", protect, softDeletePost);
router.patch("/restorepost/:id", protect, restorePost);
router.get("/getpaginationpost",pagination,getPaginatedPosts)

module.exports = router;