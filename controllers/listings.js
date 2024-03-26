const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.indexListing = async (req, res) => {
  const listings = await Listing.find();
  res.render("listings.ejs", { listings });
};

module.exports.newListingForm = (req, res) => {
  res.render("new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "authour" } })
    .populate("owner");
  res.render("show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.image = { url, filename };
  newListing.owner = req.user._id;
  newListing.geometry = response.body.features[0].geometry;
  let savedListing = await newListing.save();
  req.flash("success", "New Listing is added");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(404, "Please send valid listing");
  }
  let { id } = req.params;
  const eListing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    eListing.image = { url, filename };
    await eListing.save();
  }

  req.flash("success", "Your Listing is update successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.distroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Your Listing is deleted successfully");
  res.redirect("/listings");
};
