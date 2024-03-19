const mongoose = require("mongoose");
const mongoURL = "mongodb+srv://mahendrasooryavanshi:wNbwN3J8OcUy4Oce@cluster0.a6obw2l.mongodb.net/kanchan";

const connectToMongodb = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};
module.exports = connectToMongodb;
