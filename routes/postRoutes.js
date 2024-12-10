const express = require("express");
const { getPosts, getPost, createPost, updatePost, softDeletePost, restorePost} = require('../controllers/postController')
const postValidate = require("../middleware/postValidation");
const protect = require("../middleware/tokenValidation");
const pagination = require("../middleware/pagination");
const router = express.Router();

router.get("/posts",pagination, protect, getPosts);
router.get("/post/:id", getPost);
router.post("/createpost", protect, postValidate, createPost);
router.put("/updatepost/:id", protect, updatePost);
router.delete("/deletepost/:id", protect, softDeletePost);
router.patch("/restorepost/:id", protect, restorePost);

module.exports = router;