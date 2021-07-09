const express = require("express");
const router = express.Router();
const { Videos } = require("../models/videos.model");

router.route("/")
.get(async (req,res) => {
  try{
    const videos = await Videos.find({});
    res.json({ success:true, videos})
  } catch(err){
    res.status(500).json({ success: false, message: "unable to get videos",
    errorMessage:err.message })
  }
})

router.param("videoId", async (req, res, next, id)  => {
  try{
    const video = await Videos.findById(id)
    if(!video){
      return res.status(400).json({success:false, message:"Error getting the video"})
    }
    req.video = video;
    next();
  }catch{
    res.status(400).json({success:false, message:"Error while retrieving the video"})
  }
})

router.route("/:videoId")
.get(async (req,res) => {
  const { videoId } = req.params;
  let video = await Videos.findById(videoId);
  res.json({success:true, video})
})


module.exports = router