const Review=require("../models/review.js")
const Listing = require("../models/listing.js");


module.exports.createReview=async(req,res)=>{
    //let {id}= req.params;
    const id = req.params.id.trim();
    let listing = await Listing.findById(id);
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("review saved");
    const url = `/listings/${listing._id}`;
    req.flash("success","review created successfully!!");
  
    res.redirect(url);
}

module.exports.destroyReview=async (req, res) => {
    let { id, reviewId } = req.params;
  
    // Remove the reviewId from the reviews array in the Listing document
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  
    // Delete the review document from the Review collection
    await Review.findByIdAndDelete(reviewId);
  
    req.flash("success","review deleted successfully!!");
  
    // Redirect to the updated listing page
    res.redirect(`/listings/${id}`);  // Corrected URL syntax
};