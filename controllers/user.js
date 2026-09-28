const User = require("../models/user.js");

//signup page show
module.exports.renderSingupPage = async (req, res) => {
    res.render("users/signup.ejs")
}

//singup
module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        let newUser = new User({
            email,
            username
        });

        let user = await User.register(newUser, password);

        req.login(user, (err) => {
            if (err) {
                return next();
            }

            req.flash("success", `Welcome to Wanderlust! ${req.user.username}`);
            res.redirect("/listings");
        })

    } catch (e) {
        if (e.code === 11000 && e.keyPattern?.email) {
            req.flash("error", "A user with given Email already registered!");
        } else {
            req.flash("error", e.message);
        }
        res.redirect("/signup");
    }
}

//show login page
module.exports.renderLoginPage = async (req, res) => {
    res.render("users/login.ejs")
}

//login route
module.exports.login = async (req, res) => {
    req.flash("success", `Welcome to Wanderlust, ${req.user.username}`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

//logout route
module.exports.logout = async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "logged you out!");
        res.redirect("/listings");
    });
}