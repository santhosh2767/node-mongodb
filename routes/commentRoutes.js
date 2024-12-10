const express = require("express");
const { addComment, editComment, deleteComment, undeleteComment,
    getPostWithComment, commentList } = require('../controllers/commentController')
const protect = require("../middleware/tokenValidation");
const pagination = require("../middleware/pagination")
const router = express.Router();


router.post('/add/:postId', protect, addComment);
router.put('/edit/:commentId', protect, editComment);
router.delete('/delete/:commentId', protect, deleteComment);
router.patch('/undelete/:commentId', protect, undeleteComment);
router.get("/postwithcomment/:id", pagination, protect, getPostWithComment);
router.get("/postwithcomment", pagination, protect, commentList);

module.exports = router;