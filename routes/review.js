const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap.js");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const { isLoggedIn, isReviewAuthor, isLoggedInForReviewDelete } = require("../middleware.js");

const validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error.details[0].message);
    } else{
        next();
    }
}

const reviewContoller = require("../controllers/review.js");

//Create new Review 
router.post(
    "/",
    isLoggedIn, 
    validateReview, 
    asyncWrap(reviewContoller.createReview)
);


//destroy the review 
router.delete(
    "/:reviewId",
    isLoggedInForReviewDelete, 
    isReviewAuthor, 
    asyncWrap(reviewContoller.deleteReview)
);

module.exports = router;