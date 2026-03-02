const express = require("express");
const router=express.Router({mergeParams:true});
const Review=require("../models/review.js")
const {reviewSchema}=require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError=require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isReviewAuthor,validateReview}=require("../middleware.js");


const reviewControllers=require("../controllers/review.js");




//review post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewControllers.createReview));
  
  //review delete route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor,wrapAsync(reviewControllers.destroyReview));


module.exports=router;
  

