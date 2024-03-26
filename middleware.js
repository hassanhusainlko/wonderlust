const Listing = require("./models/listing");
const Review = require("./models/review");
const { reviewSchema, listingSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please loggedin before creating a new route");
    return res.redirect("/login");
  }
  next();
};

module.exports.savedUrl = (req, res, next) => {
  if (req.session.redirectUrl)
    res.locals.savedRedirectUrl = req.session.redirectUrl;
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You didn't create this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validationListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validationReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isAuthour = async (req, res, next) => {
  let { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.authour.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the authour of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
