const db = require("../../services/dbConnect");

exports.retrieveImage = (request, response) => {
    // data from user
    const { cloudinary_id } = request.params;
  
    db.pool.connect((err, client) => {
      // query to find image
      const retrieveQuery = "SELECT * FROM images WHERE cloudinary_id = $1";
      const value = [cloudinary_id];
  
      // execute query
      client
        .query(retrieveQuery, value)
        .then((output) => {
          response.status(200).send({
            status: "success",
            data: {
              message: "Image Retrieved Successfully!",
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
  }