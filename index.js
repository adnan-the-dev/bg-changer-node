const Background = require("./schema/BgSchema");

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(cors());
app.use(morgan("common"));

dotenv.config();

const { MONGO_URL, PORT } = process.env;

app.use(express.json());

// mongoo connection
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("succesfully connected to database");
    app.listen(PORT || 7070, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log("an error occured", err);
  });

// // POST endpoint to add a new button

app.post("/background", async (req, res) => {
  try {
    const { name, color } = req.body;

    // Efficiently check for duplicate name or color using findOne()
    const existingBackground = await Background.findOne({
      $or: [{ name }, { color }],
    });

    if (existingBackground) {
      const duplicateField =
        existingBackground.name === name ? "name" : "color";
      return res.status(400).send({
        success: false,
        message: `Already Exite ${duplicateField}`,
      });
    }

    const bg = new Background({
      name,
      color,
    });
    const savebakeground = await bg.save();
    return res.status(200).send({
      success: true,
      message: "Upload Successfly",
      result: savebakeground,
    });
    // return res.json(savebakeground);
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: e.message || "some error ecured" });
  }
});

//Get All colors api

app.get("/colors", async (req, res) => {
  try {
    const color = await Background.find();
    return res
      .status(200)
      .send({ success: true, message: "All colors", result: color });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, message: e.message || "some error ecured" });
  }
});

//Delete colors api

app.delete("/deleteBackground/:id", async (req, res) => {
  try {
    const bg = await Background.findByIdAndDelete(req.params.id);
    if (!bg) {
      return res.status(404).send({
        success: false,
        message: "BackgroundColor not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "BackgroundColor deleted successfully",
      result: bg,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: e.message || "Some error occurred",
    });
  }
});
