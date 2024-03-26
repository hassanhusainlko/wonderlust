const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const { isLoggedin, validationReview, isAuthour } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// review - review add route

router.post(
  "/reviews",
  isLoggedin,
  validationReview,
  wrapAsync(reviewController.addReview)
);

router.delete(
  "/reviews/:reviewId",
  isLoggedin,
  isAuthour,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
