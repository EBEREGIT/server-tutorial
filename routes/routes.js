const express = require("express");
const router = express.Router();
const imageUpload = require("./controllers/imageUpload");
const persistImage = require("./controllers/persistImage");
const retrieveImage = require("./controllers/retrieveImage");
const updateImage = require("./controllers/updateImage");
const deleteImage = require("./controllers/deleteImage");

router.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

// image upload API
router.post("/image-upload", imageUpload.imageUpload);

// persist image
router.post("/persist-image", persistImage.persistImage);

// retrieve image
router.get("/retrieve-image/:cloudinary_id", retrieveImage.retrieveImage);

// delete image
router.delete("/delete-image/:cloudinary_id", deleteImage.deleteImage);

// update image
router.put("/update-image/:cloudinary_id", updateImage.updateImage);

module.exports = router;
