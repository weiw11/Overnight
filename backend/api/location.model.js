const mongoose = require("mongoose");
const { Schema } = mongoose;

const locationSchema = new Schema(
  {
    id: {
      type: Number,
      require: true
    },
    name: {
      type: String,
      require: true
    },
    type: {
      type: String,
      require: true
    },
    region: {
      type: String,
      require: true
    },
    city: {
      type: String,
      require: true
    },
    county: {
      type: String,
    },
    latitude: {
      type: String,
      require: true
    },
    longitude: {
      type: String,
      require: true
    },
    type_specific: {
      fee: {
        type: String,
        require: true
      }
    }
  }
);

module.exports = mongoose.model("projects", locationSchema, "overnight");