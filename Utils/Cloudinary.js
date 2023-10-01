const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const cloudinaryUploadImg = async (fileToUpload) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto", // specify the resource type
    }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          url: result.secure_url, // 'secure_url' instead of 'secure.url'
          asset_id : result.asset_id,
          public_id : result.public_id
        });
      }
    });
  });
};
const cloudinaryDeleteImg = async (fileToDelete) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(fileToDelete, {
      resource_type: "auto", // specify the resource type
    }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          url: result.secure_url, // 'secure_url' instead of 'secure.url'
          asset_id : result.asset_id,
          public_id : result.public_id
        });
      }
    });
  });
};

module.exports = {cloudinaryUploadImg, cloudinaryDeleteImg};
