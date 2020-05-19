const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const db = require("../services/dbConnect.js");

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

router.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

// image upload API
router.post("/image-upload", (request, response) => {
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
});

// persist image
router.post("/persist-image", (request, response) => {
  // collected image from a user
  const data = {
    title: request.body.title,
    image: request.body.image,
  };

  // upload image here
  cloudinary.uploader
    .upload(data.image)
    .then((image) => {
      db.pool.connect((err, client) => {
        // inset query to run if the upload to cloudinary is successful
        const insertQuery =
          "INSERT INTO images (title, cloudinary_id, image_url) VALUES($1,$2,$3) RETURNING *";
        const values = [data.title, image.public_id, image.secure_url];

        // execute query
        client
          .query(insertQuery, values)
          .then((result) => {
            result = result.rows[0];

            // send success response
            response.status(201).send({
              status: "success",
              data: {
                message: "Image Uploaded Successfully",
                title: result.title,
                cloudinary_id: result.cloudinary_id,
                image_url: result.image_url,
              },
            });
          })
          .catch((e) => {
            response.status(500).send({
              message: "failure",
              e,
            });
          });
      });
    })
    .catch((error) => {
      response.status(500).send({
        message: "failure",
        error,
      });
    });
});
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
