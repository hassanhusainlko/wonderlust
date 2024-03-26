const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.Data = initData.Data.map((obj) => ({
    ...obj,
    owner: "65faa9441913bade6e34d47f",
  }));
  const newData = await Listing.insertMany(initData.Data);
};

initDB();
