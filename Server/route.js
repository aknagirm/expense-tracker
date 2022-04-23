const express = require("express");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const { sectionModel, dateRangeModel } = require("./models/section-model");
const User = require("./models/user-model");
const verifyRequest = require("./verify-token");

require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

const route = express.Router();

route.post("/registration", (req, res) => {
  let user = req.body.userDetails;
  user.creationDate = new Date();
  user.transactions = [];
  let newUser = new User(user);
  newUser.save((err, user) => {
    if (err) {
      res.status(500).send({ msg: "Something is wrong" });
    } else {
      let payload = { _id: user._id, emailId: user.emailId };
      let token = jwt.sign(payload, secretKey);
      res.status(200).send({
        msg: "new user created",
        token: token,
        user: user,
      });
    }
  });
});

route.post("/login", (req, res) => {
  let userData = req.body.userDetails;
  User.findOne({ emailId: userData.emailId }, (err, user) => {
    if (!user) {
      res.status(402).send({ msg: "User not found" });
    } else {
      if (user.password !== userData.password) {
        res.status(402).send({ msg: "Invalid Password" });
      } else {
        let payload = { _id: user._id, emailId: user.emailId };
        let token = jwt.sign(payload, secretKey);
        res.status(200).send({
          token: token,
          user: user,
        });
      }
    }
  });
});

route.get("/section", (req, res) => {
  sectionModel.find((err, data) => {
    if (err) {
      res.status(500).send({ msg: "Something is wrong" });
    } else {
      res.status(200).send(data);
    }
  });
});

route.post("/mailOtp", async (req, res) => {
  try {
    let user = await User.findOne({ emailId: req.body.emailId }).exec();
    if (user) {
      let err = new Error();
      err.code = "USER_EXIST";
      throw err;
    } else {
      var val = Math.floor(100000 + Math.random() * 900000);
      var transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 587,
        ignoreTLS: false,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      var mailOptions = {
        from: process.env.MAIL_USER,
        to: req.body.email,
        subject: "OTP for MakeUrMark mail verification",
        html: `<p>Hi</p>
                <br>
                <p>Thanks for choosing MakeUrMark. This is just a automailer. Your mail OTP is: <strong>${val}</strong>.</p>
                <p>This OTP is valid for next 2 min only.</p>
                <br>
                <p>Regards</p>
                <p>MakeURMark</p>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          let err = new Error();
          err.code = "UNKNOWN_MAIL_ID";
          throw err;
        } else {
          res.status(200).send({ mailOtp: val });
        }
      });
      /* } */
    }
  } catch (err) {
    if (err.code == "UNKNOWN_MAIL_ID") {
      res.status(500).send({ msg: "need to check email id" });
    } else if (err.code == "USER_EXIST") {
      res.status(500).send({ msg: "Email Id already Registered" });
    } else {
      res.status(500).send({ msg: "Something is wrong" });
    }
  }
});

route.get("/getUserDetails", verifyRequest, (req, res) => {
  let email = req.emailId ? req.emailId : null;
  if (!email) {
    res.status(404).send({ msg: "User not found" });
  } else {
    User.findOne({ emailId: email }, (err, userDetails) => {
      if (err) {
        res.status(404).send({ msg: "User not found" });
      } else {
        res.status(200).send(userDetails);
      }
    });
  }
});

route.post("/saveTransaction", verifyRequest, async (req, res) => {
  try {
    let email = req.emailId ? req.emailId : null;
    let transDetails = req.body.transDetails;
    transDetails["creationDate"] = new Date();
    if (!email) {
      throw err;
    } else {
      let user = await User.findOne({ emailId: email }).exec();
      user.transactions.push(transDetails);
      await user.save();
      res.status(200).send({ msg: "Transaction details saved successfully" });
    }
  } catch (err) {
    res.status(404).send({ msg: "User not found" });
  }
});

route.post("/getTransaction", verifyRequest, async (req, res) => {
  try {
    let email = req.emailId ? req.emailId : null;
    if (!email) {
      throw err;
    } else {
      let endDt = new Date(req.body.endDt);
      let startDt = new Date(req.body.startDt);
      let userDetails = await User.findOne({
        emailId: email,
      }).exec();
      const transListAll = userDetails.transactions;
      let transList = [];
      for (let i = 0; i < transListAll.length; i++) {
        if (
          startDt.getTime() <= transListAll[i].transDate.getTime() &&
          transListAll[i].transDate.getTime() <= endDt.getTime()
        ) {
          transList.push(transListAll[i]);
        }
      }
      res.status(200).send(transList);
    }
  } catch (err) {
    res.status(500).send({ msg: "Something is wrong" });
  }
});

route.get("/getDateRange", async (req, res) => {
  try {
    const dateRangeData = await dateRangeModel.find({}).exec();
    res.status(200).send(dateRangeData);
  } catch (err) {
    res.status(500).send({ msg: "Something is wrong" });
  }
});

route.delete("/deleteTransaction", verifyRequest, async (req, res) => {
  try {
    let email = req.emailId ? req.emailId : null;
    let userDetails = await User.findOne({
      emailId: email,
    }).exec();
    console.log(req.query._id);
    const trxItemIdx = userDetails.transactions.findIndex(
      (eachTrx) => eachTrx._id.toString() == req.query._id.toString()
    );
    console.log(trxItemIdx);
    if (trxItemIdx !== -1) {
      userDetails.transactions.splice(trxItemIdx, 1);
      await userDetails.save();
    }
    res
      .status(200)
      .send({
        msg: "Transaction deleted successfully",
        data: userDetails.transactions,
      });
  } catch (err) {
    res.status(500).send({ msg: "Something is wrong" });
  }
});

module.exports = route;
