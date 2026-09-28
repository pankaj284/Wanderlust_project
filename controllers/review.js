const Review = require("../models/review.js");
const Listing = require("../models/listing");

//create the new Review
module.exports.createReview = async (req, res) => {
    console.log(req.body)
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing Not Found!");
    }
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; //adding the author to the reviewPost

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Added!");

    res.redirect(`/listings/${req.params.id}`);
}

//destroy the review
module.exports.deleteReview = async (req, res) => {
    //go to listing - review - delete the specific review id
    //go to review - delete using - review id
    let { reviewId, id } = req.params;

    await Review.findByIdAndDelete(reviewId);

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    req.flash("success", "Review has Deleted!");

    res.redirect(`/listings/${id}`);
}