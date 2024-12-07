const express = require("express");
const { registerUser, loginUser, listUsers, singleUser, uploadProfilePic, accDelete } = require("../controllers/userController");
const uploadAndResizeImage = require('../middleware/multer')
const validateUser = require("../middleware/userValidation");
const protect = require("../middleware/tokenValidation");
const router = express.Router();

router.post("/register", validateUser, registerUser);
router.post("/login", loginUser);
router.get("/list",protect, listUsers);
router.get("/profile/:id", protect, singleUser);
router.delete("/accdelete/:id",protect,accDelete)
// router.patch("/accrestore/:id",protect,accRestore)
router.post("/profilepic", uploadAndResizeImage, uploadProfilePic);




module.exports = router;
