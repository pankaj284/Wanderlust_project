const Listing = require("../models/listing");
const mapToken = process.env.MAP_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

//index route -> show all listings
module.exports.index = async (req, res, next) => {
    const { category } = req.query;
    const { location } = req.query;
    if (location) {
        const listings = await Listing.find({ location: location });
        return res.render("listings/index.ejs", { allListings: listings })
    }
    if (category) {
        const listings = await Listing.find({ category: category });
        return res.render("listings/index.ejs", { allListings: listings });
    }
    const allListings = await Listing.find({});
    return res.render("listings/index.ejs", { allListings });

}

//render page -> add listing
module.exports.renderAddListing = async (req, res, next) => {
    res.render("listings/new.ejs");
}

//render page -> show
module.exports.showListing = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner");


    if (!listing) {
        req.flash("error", "listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

// create listing 
module.exports.createListing = async (req, res, next) => {

    let response = await geoCodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send()

    let filename = req.file.filename;
    let url = req.file.path;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    req.flash("success", "New listing created!");

    res.redirect("/listings");
}

//render Edit listing page
module.exports.renderEditListing = async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", {
        listing
    });
};

//edit listing
module.exports.editListing = async (req, res, next) => {
    let { id } = req.params;

    if (!req.body.listing) {
        return next(new ExpressError(400, "Send Valid Data for Listing"));
    }

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        let filename = req.file.filename;
        let url = req.file.path;
        listing.image.filename = filename;
        listing.image.url = url;
        await listing.save();
    }

    req.flash("success", "listing has updated!");
    res.redirect(`/listings/${id}`)
}

//Delete the listing
module.exports.destroyListing = async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);

    if (!listing) {
        req.flash("error", "listing not found!");
        return res.redirect("/listings");
    }

    req.flash("success", "listing has deleted!");

    res.redirect("/listings");
}