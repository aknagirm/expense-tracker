const jwt = require("jsonwebtoken");
const User = require("./models/user-model");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

module.exports = function verifyToken(req, res, next) {
  setTimeout(() => {
    if (!req.headers.authorization) {
      return res.status(402).send("Please Login First");
    } else {
      let token = req.headers.authorization.split(" ")[1];
      if (token === "null") {
        return res.status(402).send("Please Login First");
      } else {
        try {
          let payload = jwt.verify(token, secretKey);
          if (payload.emailId) {
            User.findOne({ emailId: payload.emailId }, (err, user) => {
              if (err) {
                return res.status(401).send("Unauthorized request");
              } else {
                if (user.emailId == payload.emailId) {
                  req.emailId = payload.emailId;
                  req.firstName = payload.firstName;
                  req.lastName = payload.lastName;
                  next();
                } else {
                  return res.status(401).send("Unauthorized request");
                }
              }
            });
          } else {
            return res.status(401).send("Unauthorized request");
          }
        } catch (err) {
          return res.status(401).send("Unauthorized request");
        }
      }
    }
  }, 100);
};
