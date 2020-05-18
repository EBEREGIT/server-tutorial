const express = require("express");
const router = express.Router();
const imageUpload = require("./controllers/imageUpload");
const persistImage = require("./controllers/persistImage")

router.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

// image upload API
router.post("/image-upload", imageUpload.imageUpload);

// persist image
router.post("/persist-image", persistImage.persistImage);

// retrieve image
router.get("/retrieve-image/:cloudinary_id", (request, response) => {
  // data from user
  const { cloudinary_id } = request.params;

  db.pool.connect((err, client) => {
    // query to find image
    const query = "SELECT * FROM images WHERE cloudinary_id = $1";
    const value = [cloudinary_id];

    // execute query
    client
      .query(query, value)
      .then((output) => {
        response.status(200).send({
          status: "success",
          data: {
            id: output.rows[0].cloudinary_id,
            title: output.rows[0].title,
            url: output.rows[0].image_url,
          },
        });
      })
      .catch((error) => {
        response.status(401).send({
          status: "failure",
          data: {
            message: "could not retrieve record!",
            error,
          },
        });
      });
  });
});

// delete image
router.delete("/delete-image/:cloudinary_id", (request, response) => {
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
});

// update image
router.put("/update-image/:cloudinary_id", (request, response) => {
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
});

module.exports = router;
