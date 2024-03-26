const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const router = express.Router();
const { isLoggedin, isOwner, validationListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
``;

router
  .route("/")
  .get(wrapAsync(listingController.indexListing))
  .post(
    isLoggedin,
    upload.single("listing[image]"),
    validationListing,
    wrapAsync(listingController.createListing)
  );

// Create Route
router.get("/new", isLoggedin, listingController.newListingForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedin,
    isOwner,
    upload.single("listing[image]"),
    validationListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isOwner, isLoggedin, wrapAsync(listingController.distroyListing));

// Edit Route
router.get("/:id/edit", isLoggedin, wrapAsync(listingController.editListing));

module.exports = router;
