const express = require("express");
const { toggleLikePost, toggleLikeList } = require('../controllers/likeController')
const protect = require("../middleware/tokenValidation");
const router = express.Router();


router.patch('/togglelike/:id', protect, toggleLikePost);
router.get('/togglelikelist', protect, toggleLikeList);

module.exports = router;