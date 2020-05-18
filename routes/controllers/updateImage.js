const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const db = require("../../services/dbConnect");

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.updateImage = (request, response) => {
    // unique ID
    const { cloudinary_id } = request.params;
  
    // collected image from a user
    const data = {
      title: request.body.title,
      image: request.body.image,
    };
  
    // delete image from cloudinary first
    cloudinary.uploader
      .destroy(cloudinary_id)
  
      // upload image here
      .then(() => {
        cloudinary.uploader
          .upload(data.image)
  
          // update the database here
          .then((result) => {
            db.pool.connect((err, client) => {
              // update query
              const updateQuery =
                "UPDATE images SET title = $1, cloudinary_id = $2, image_url = $3 WHERE cloudinary_id = $4";
              const value = [
                data.title,
                result.public_id,
                result.secure_url,
                cloudinary_id,
              ];
  
              // execute query
              client
                .query(updateQuery, value)
                .then(() => {
                  // send success response
                  response.status(201).send({
                    status: "success",
                    data: {
                      message: "Image Updated Successfully",
                    },
                  });
                })
                .catch((e) => {
                  response.status(500).send({
                    message: "Update Failed",
                    e,
                  });
                });
            });
          })
          .catch((err) => {
            response.status(500).send({
              message: "failed",
              err,
            });
          });
      })
      .catch((error) => {
        response.status(500).send({
          message: "failed",
          error,
        });
      });
  }