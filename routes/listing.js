const express = require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError=require("../utils/expressError.js");
const {listingSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
const {validateListing}=require("../middleware.js");

const listingController=require("../controllers/listing.js");

///for uploading image multer is neccessary
const multer = require('multer');
const { storage } = require('../cloudConfig');  // NOTE: use destructuring here
// const upload = multer({ dest: 'uploads/' }) //store localy
const upload = multer({ storage });    //store in cloudinary storage backend



router
    .route("/")
    //index route
    .get(wrapAsync(listingController.index))
    //new 
    .post(isLoggedIn, upload.fields([
        { name: 'listing[image]', maxCount: 1 },
        { name: 'listing[extraImage]', maxCount: 1 },
      ]),validateListing,wrapAsync(listingController.createListing));
    

///create new route
router.get("/new",isLoggedIn,listingController.renderNewForm);




router.route("/:id")
    //show or read route
    .get( wrapAsync(listingController.showListing))
    //update route
    .put(isLoggedIn,isOwner,upload.fields([
        { name: 'listing[image]', maxCount: 1 },
        { name: 'listing[extraImage]', maxCount: 1 },
      ]),validateListing,wrapAsync(listingController.updateListing))
    //delete route
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListings));


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));




module.exports =router;