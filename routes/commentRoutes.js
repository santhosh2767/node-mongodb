const express = require("express");
const {  addComment,editComment,deleteComment,undeleteComment,} = require('../controllers/commentController')
const protect = require("../middleware/tokenValidation");
const router = express.Router();


router.post('/addcomment/:postId', protect, addComment);
router.put('/editcomment/:commentId', protect, editComment);
router.delete('/deletecomment/:commentId', protect, deleteComment);
router.patch('/undeletecomment/:commentId', protect, undeleteComment);
module.exports = router;