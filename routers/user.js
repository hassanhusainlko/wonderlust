const express = require("express");
const router = express.Router();
const Listing = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { savedUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(userController.signUpUser)
  .post(wrapAsync(userController.createUser));

router
  .route("/login")
  .get(userController.loginForm)
  .post(
    savedUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginAuthentication
  );

// Logout User
router.get("/logout", userController.logoutUser);

module.exports = router;
