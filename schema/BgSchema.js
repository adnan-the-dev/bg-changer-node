let mongoose = require("mongoose");

let backgroundSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Background", backgroundSchema);
