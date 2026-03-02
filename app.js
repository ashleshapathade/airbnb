if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const expressError = require("./utils/expressError.js");

// Routers & models
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const Listing = require("./models/listing.js");
const User = require("./models/user.js");

// Auth
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Flash & Session
const session = require("express-session");
const flash = require("connect-flash");

// EJS
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static & Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ------------------- DATABASE -------------------
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/listingsDB";

mongoose.connect(dbUrl)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

// ------------------- SESSION & FLASH -------------------
const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());

// ------------------- PASSPORT -------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ------------------- LOCALS -------------------
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ------------------- ROUTES -------------------
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// ------------------- ERROR HANDLING -------------------
app.all("*", (req, res, next) => {
  next(new expressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error", { message });
});

// ------------------- HOME -------------------
app.get("/", (req, res) => {
  res.send("Working!!");
});

// ------------------- SERVER -------------------
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});