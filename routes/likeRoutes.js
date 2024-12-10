const express = require("express");
const { toggleLikePost, toggleLikeList,getPostWithLike } = require('../controllers/likeController')
const protect = require("../middleware/tokenValidation");
const pagination = require("../middleware/pagination")
const router = express.Router();


router.patch('/togglelike/:id', protect, toggleLikePost);
router.get('/postwithlike',pagination,protect, toggleLikeList);
router.get('/postwithlike/:id',pagination,protect,getPostWithLike);


module.exports = router;