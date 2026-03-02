const mongoose=require("mongoose");
const Review = require("./review");
const Schema=mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
        url:String,
        filename:String,


        // type: String,
        // default: "https://plus.unsplash.com/premium_photo-1666901328734-3c6eb9b6b979?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // set: (v) => (v == null || v.trim() === "") ? undefined : v
        
    },
    extraImage: {
        url: String,
        filename: String
    },
      
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owners:{
        type:Schema.Types.ObjectId,
        ref:"User",
        
    },
    category:{
        type:String,
        enum:['Trending','Rooms','Iconic Cities','Mountains',
            'Amazing Pools','Island','Desert','Farms','Beachfront','Arctic','Towers'],
        required: true
    }
});


//mongoose middleware
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{ $in:listing.reviews }});
    }
});

const Listing =mongoose.model("Listing",listingSchema);
module.exports=Listing;

