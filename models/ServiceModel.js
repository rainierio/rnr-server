const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const ServiceSchema = new Schema({
  title: { type: String, required: true },
  introdesc: { type: String, required: true },
  content: { type: String, required: true },
  company: { type: String, required: true },
  image: { type: Array },
});

module.exports = Service = mongoose.model("service", ServiceSchema, "services");
