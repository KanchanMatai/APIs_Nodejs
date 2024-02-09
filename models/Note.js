const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
  user: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  title: {
    type: String,
    require:true
  },
  description: {
    type: String,
    require:true
  },
  price: {
    type: String,
    require:true
  },
  size: {
    type: String,
    require:true
  },
  color: {
    type: String,
    require:true
  },
  date: {
    type: Date,
    default: Date.now
  }

});

module.exports =  mongoose.model("Note",NotesSchema)