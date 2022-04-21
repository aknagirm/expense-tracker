const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionsSchema = new Schema({
  creationDate: Date,
  transDate: Date,
  creditDebitInd: String,
  sectionValue: String,
  transAmount: String,
  note: String,
});

const userModel = new Schema({
  creationDate: Date,
  firstName: String,
  lastName: String,
  emailId: String,
  passWord: String,
  transactions: [transactionsSchema],
});

module.exports = mongoose.model("userDetails", userModel, "userDetails");
