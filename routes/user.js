const express = require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError=require("../utils/expressError.js");


var flash = require('connect-flash');
const passport=require("passport");     //passport authetication
const LocalStrategy=require("passport-local");
const User = require('../models/user.js');
const { saveRedirectUrl } = require("../middleware.js");

const userControllers=require("../controllers/user.js");


router.route("/signup")
  //signUp user get
  .get(userControllers.renderSignupForm)
  //signUp user post
  .post(wrapAsync(userControllers.signup));
  

router.get("/login", userControllers.renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userControllers.login
);


 ///logout
router.get("/logout",userControllers.logout);
  
  

module.exports=router;