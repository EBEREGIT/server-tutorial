const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const db = require("../../services/dbConnect");

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.deleteImage = (request, response) => {
  // unique ID
  const { cloudinary_id } = request.params;

  // delete image from cloudinary first
  cloudinary.uploader
    .destroy(cloudinary_id)

    // delete image record from postgres also
    .then(() => {
      db.pool.connect((err, client) => {
        // delete query
        const deleteQuery = "DELETE FROM images WHERE cloudinary_id = $1";
        const deleteValue = [cloudinary_id];

        // execute delete query
        client
          .query(deleteQuery, deleteValue)
          .then((deleteResult) => {
            response.status(200).send({
              message: "Image Deleted Successfully!",
              deleteResult,
            });
          })
          .catch((e) => {
            response.status(500).send({
              message: "Image Couldn't be Deleted!",
              e,
            });
          });
      });
    })
    .catch((error) => {
      response.status(500).send({
        message: "Failure",
        error,
      });
    });
};
