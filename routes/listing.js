if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}



const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const Listing = require("../models/listing.js")

const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }
});


const validateListing = (req, res, next) => {

    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }

    if (!req.file && req.method != 'PUT') {
        throw new ExpressError(400, "Image is required");
    }

    return next();

}

router.post("/cities", async (req, res) => {
    let listings = await Listing.find({});
    return res.json(listings);
})

const listingController = require("../controllers/listing");

router
    .route("/")
    .get(
        asyncWrap(listingController.index)
    )
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        asyncWrap(listingController.createListing)
    )


//create new listing Route
router.get(
    "/new",
    isLoggedIn,
    asyncWrap(listingController.renderAddListing)
);

//Show the specific listing Route
router.get(
    "/:id",
    asyncWrap(listingController.showListing)
)

router
    .route("/:id/edit")
    .get(
        isLoggedIn,
        isOwner,
        asyncWrap(listingController.renderEditListing)
    )
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        asyncWrap(listingController.editListing)
    )


//Delete specific listing page route
router.delete(
    "/:id/delete",
    isLoggedIn,
    isOwner,
    asyncWrap(listingController.destroyListing)
)

router.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})




module.exports = router;