const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  const { category, search } = req.query;

  let listings = allListings;

  // Filter by category
  if (category) {
    listings = listings.filter(listing =>
      (listing.category || "").toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    const searchTerm = search.toLowerCase();
    listings = listings.filter(listing => {
      const location = listing.location?.toLowerCase() || "";
      const category = listing.category?.toLowerCase() || "";
      const country = listing.country?.toLowerCase() || "";
  
      return (
        location.includes(searchTerm) ||
        category.includes(searchTerm) ||
        country.includes(searchTerm)
      );
    });
    // console.log("Search Term:", search);
    // console.log("Listings after filtering:", listings.length);

  }
  

  

  res.render("index", { listings, category, search, allListings });
};


module.exports.renderNewForm=(req,res)=>{
  
    res.render("new.ejs");
      
};

module.exports.showListing=async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path:"reviews",
    populate:{
      path:"author",
    },
  })
  .populate("owners");
  // console.log(listing);
  // if (!listing) {
  //     throw new expressError("404", "Listing not found");
  // }
  if(!listing){
    req.flash("error","Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  const { listing } = req.body;

  const newListing = new Listing(listing);

  // Assign logged-in user as owner
  newListing.owners = req.user._id;

  // Upload main image
  if (req.files && req.files["listing[image]"]) {
    const image = req.files["listing[image]"][0];
    newListing.image = {
      url: image.path,
      filename: image.filename
    };
  }

  // Upload extra image
  if (req.files && req.files["listing[extraImage]"]) {
    const extraImage = req.files["listing[extraImage]"][0];
    newListing.extraImage = {
      url: extraImage.path,
      filename: extraImage.filename
    };
  }

  console.log(req.user);
  await newListing.save();

  req.flash("success", "New listing created successfully!");
  res.redirect("/listings");
};

  
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }

  let originalImageUrl = '';
  if (listing.image && listing.image.url) {
    originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
  }

  let originalExtraImageUrl = '';
  if (listing.extraImage && listing.extraImage.url) {
    originalExtraImageUrl = listing.extraImage.url.replace("/upload", "/upload/w_250");
  }

  res.render("edit.ejs", { listing, originalImageUrl, originalExtraImageUrl });
};


module.exports.updateListing=async(req,res)=>{
  {
    if(!req.body.listing){ throw new expressError("400","send valid data for listings")}
    let {id}= req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    // if(typeof req.file !="undefined"){     //// if we edit listings... 
    //   let url=req.file.path;               // and we edit all except image then this If condition is required       
    //   let filename=req.file.filename;
    //   listing.image={url,filename};
    //   listing.extraImage={url,filename};
    //   listing.save();

    // }
    if (req.files) {
      if (req.files['listing[image]'] && req.files['listing[image]'][0]) {
        const file = req.files['listing[image]'][0];
        listing.image = {
          url: file.path,
          filename: file.filename,
        };
      }
  
      if (req.files['listing[extraImage]'] && req.files['listing[extraImage]'][0]) {
        const file = req.files['listing[extraImage]'][0];
        listing.extraImage = {
          url: file.path,
          filename: file.filename,
        };
      }
  
      await listing.save();
    }
  
    req.flash("success"," listing updated successfully!!");

    res.redirect(`/listings/${id}`);
  }
};

module.exports.destroyListings=async(req,res)=>{
    let {id}= req.params;
    let deleteListings = await Listing.findByIdAndDelete(id);
    console.log(deleteListings);
    req.flash("success","listing deleted successfully!!");
  
    res.redirect("/listings");
};

