const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const Listing = require("./models/listing.js")

//routes
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const LocalStrategy = require("passport-local");
const passport = require("passport");
const User = require("./models/user.js");

const MONGO_URL = process.env.MONGODB_URI;

main()
    .then((res) => {
        console.log("DB connected")
    })
    .catch(err => console.log(`DB connection error: ` + err))

async function main() {
    await mongoose.connect(MONGO_URL);
}

const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    touchAfter: 24 * 3600,
    crypto: {
        secret: process.env.SECRET
    }
})


const sessionOpt = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate);
app.use(express.static(path.join("public")));

app.use(session(sessionOpt));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.use("/listings", listingsRouter);
app.use("/listings/:id/review", reviewsRouter);
app.use("/", userRouter);

app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
    if (!err) return next();
    let { statusCode = 500, message = "Something Went Wrong" } = err;
    console.error(err);
    res.status(statusCode).render("error", { message });
})

app.listen(8080, () => {
    console.log("app is listening on port 8080");
})