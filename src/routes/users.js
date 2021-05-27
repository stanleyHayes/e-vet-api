const express = require("express");
const {deleteUser, getUser, getUsers, createUser, updateUser} = require("../controllers/users.js");
const {auth, authorize} = require("../middleware/authentication.js");

const router = express.Router({mergeParams: true});

router.route('/')
    .post(auth, authorize('SUPER_ADMIN'), createUser)
    .get(auth, authorize('SUPER_ADMIN'), getUsers);

router.route('/:id')
    .get(auth, authorize('SUPER_ADMIN'), getUser)
    .put(auth, authorize('SUPER_ADMIN'), updateUser)
    .delete(auth, authorize('SUPER_ADMIN'), deleteUser);

module.exports = router;