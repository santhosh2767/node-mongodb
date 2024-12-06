const express = require("express");
const{toggleLikePost} = require('../controllers/likeController')
const protect = require("../middleware/tokenValidation");
const router = express.Router();


router.patch('/togglelike/:id', protect, toggleLikePost);

module.exports = router;