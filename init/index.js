
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
    path: path.join(__dirname, "..", ".env")
});

const mapToken = process.env.MAP_TOKEN;

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geoCodingClient = mbxGeocoding({
    accessToken: mapToken
});

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://localhost:27017/wonderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("DB connected");
}

const initDB = async function () {
    await Listing.deleteMany({});

    const listings = initData.data;

    const savedListings = await Listing.insertMany(listings);

    console.log("Data initialized");
};

main()
    .then(() => initDB())
    .then(() => mongoose.connection.close())
    .catch(async (err) => {
        console.log("Error:", err);
        await mongoose.connection.close();
    });