const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.imageUpload = (request, response) => {
  // collected image from a user
  const data = {
    image: request.body.image,
  };

  // upload image here
  cloudinary.uploader
    .upload(data.image)
    .then((result) => {
      response.status(200).send({
        message: "success",
        result,
      });
    })
    .catch((error) => {
      response.status(500).send({
        message: "failure",
        error,
      });
    });
};
