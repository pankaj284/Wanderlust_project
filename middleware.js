const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please log in to continue");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "you don't have permission");
        return res.redirect(`/listings/${id}`)
    }

    next();
}


module.exports.isLoggedInForReviewDelete = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = `/listings/${req.params.id}`;

        req.flash("error", "Please log in to continue");

        return res.redirect("/login");
    }

    next();
};


module.exports.isReviewAuthor = async (req, res, next) => {
    let { reviewId, id } = req.params;
    // const listing = await Listing.findById(id);
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You did not create this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
}