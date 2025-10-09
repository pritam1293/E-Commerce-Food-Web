const express = require('express');
const router = express.Router();

const { registerUser, loginUser, updateUserDetails, deleteUser } = require('../controllers/authController');


router.post('/signup', registerUser);

router.post('/signin', loginUser);

router.put('/update', updateUserDetails);

router.delete('/delete', deleteUser);

module.exports = router;