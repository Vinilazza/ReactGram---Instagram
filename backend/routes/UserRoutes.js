const express = require("express");
const router = express.Router();

// Controller
const {
  register,
  getCurrentUser,
  login,
  update,
  getUserById,
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
} = require("../controllers/UserController");

// Middlewares
const validate = require("../middlewares/handleValidations");
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
} = require("../middlewares/userValidations");
const authGuard = require("../middlewares/authGuard");
const { imageUpload } = require("../middlewares/imageUpload");

// Routes
router.post("/register", userCreateValidation(), validate, register);
router.get("/profile", authGuard, getCurrentUser);
router.post("/login", loginValidation(), validate, login);
router.put(
  "/",
  authGuard,
  userUpdateValidation(),
  validate,
  imageUpload.single("profileImage"),
  update
);
router.get("/:id", getUserById);
router.post("/follow/:id", authGuard, followUser);
router.post("/unfollow/:id", authGuard, unfollowUser);
router.get("/following/:id", authGuard, getFollowing);
router.get("/followers/:id", authGuard, getFollowers);
module.exports = router;
