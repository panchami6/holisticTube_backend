const mongoose = require("mongoose");
const { Schema } = mongoose;

const VideosSchema = new Schema({
  title:{
    type:String,
    required:true
  },
  avatar:{
    type:String,
    required:true
  },
  author:{
    type:String,
    required:true
  },
  subscribers:{
    type:Number,
    required:true
  },
  image:{
    type:String,
    required:true
  },
  views:{
    type:Number,
    required:true
  },
  description:{
    type:String,
    required:true
  }
});

const Videos = mongoose.model("Videos", VideosSchema);
module.exports = { Videos }