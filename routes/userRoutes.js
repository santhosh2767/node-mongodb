const express = require("express");
const { registerUser, loginUser, listUsers, singleUser, uploadProfilePic, accDelete } = require("../controllers/userController");
const uploadAndResizeImage = require('../middleware/multer')
const validateUser = require("../middleware/userValidation");
const protect = require("../middleware/tokenValidation");
const pagination = require("../middleware/pagination.js")
const router = express.Router();

router.post("/register", validateUser, registerUser);
router.post("/login", loginUser);
router.get("/list", pagination, protect, listUsers);
router.get("/list/:id", protect, singleUser);
router.delete("/accdelete/:id", protect, accDelete);
router.post("/profilepic", uploadAndResizeImage, uploadProfilePic);




module.exports = router;
