const express = require("express");

const router = express.Router({mergeParams: true});
const {register, updateProfile, deleteProfile, getProfile, login, logout, changePassword} = require("../controllers/authentication.js");
const {auth} = require("../middleware/authentication.js");

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.delete('/profile', auth, deleteProfile);
router.get('/logout', auth, logout);
router.put('/change-password', auth, changePassword);
module.exports = router;