const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sectionModel = new Schema({
  label: String,
  value: String,
  cdInd: String,
  icon: String,
});

const sectionModelModule = mongoose.model(
  "trackSection",
  sectionModel,
  "trackSection"
);

const dateRangeModel = new Schema({
  dateRange: Number,
});

const dateRangeModelModule = mongoose.model(
  "dateRangeDetails",
  dateRangeModel,
  "dateRangeDetails"
);

module.exports = {
  sectionModel: sectionModelModule,
  dateRangeModel: dateRangeModelModule,
};
