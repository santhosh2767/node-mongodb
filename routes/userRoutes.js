const express = require('express');
const { registerUser, loginUser, listUsers } = require('../controllers/userController');
const validateUser = require('../middleware/validation');

const router = express.Router();

router.post('/register', validateUser, registerUser);
router.post('/login', loginUser);
router.get('/list', listUsers);

module.exports = router;
