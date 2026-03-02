const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Setting up the Cloudinary Storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'AirbnbProject',  // your folder name in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg','avif' ,' webp']
    }
});

module.exports = {
    cloudinary,
    storage
};

















// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// cloudinary.config({
//     cloud_name:process.env.CLOUD_NAME,
//     api_key:process.env.CLOUD_API_KEY,
//     api_secret:process.envCLOUD_API_SECRET
// })

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'wanderlust_DEV',
//       allowed_formats: ['png','jpg','jpeg'] // supports promises as well
      
//     },
//   });

// module.exports={
//     cloudinary,
//     storage,
// }