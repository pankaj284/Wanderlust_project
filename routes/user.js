const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const asyncWrap = require("../utils/asyncWrap.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js")

const userController = require("../controllers/user.js");

router
    .route("/signup")
    .get(
        asyncWrap(userController.renderSingupPage)
    )
    .post(
        asyncWrap(userController.signup)
    );


router
    .route("/login")
    .get(
        asyncWrap(userController.renderLoginPage)
    )
    .post(
        saveRedirectUrl,
        passport.authenticate(
            "local",
            { failureRedirect: "/login", failureFlash: true }
        ),
        asyncWrap(userController.login)
    )

//logout route
router.get(
    "/logout",
    asyncWrap(userController.logout)
);


module.exports = router;

