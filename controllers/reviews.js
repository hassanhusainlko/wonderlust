const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.addReview = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(req.params.id);

  let newReview = new Review(req.body.review);
  newReview.authour = req.user._id;
  console.log(newReview);
  listing.reviews.push(newReview);

  let res2 = await newReview.save();
  let res1 = await listing.save();

  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
};
