const express = require("express");
const router = express.Router();
const { WatchLater } = require("../models/watchLater.model");
const { TubeUser } = require("../models/user.model");
const authVerify = require("./verifyToken");

router.param("userId", async (req, res, next, userId) => {
  try{
    const user = await TubeUser.findById({ _id:userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this Id",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "User not found",
      errorMessage: err.message,
    });
  }
})

router.route("/:userId")
.get(async (req, res) => {
   try {
    const {userId} = req.params;
    let watchLater = await WatchLater.findOne({ userId });
    res.status(200).json({ success: true, watchLater });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Request failed please check errorMessage key for more details",
      errorMessage: error.message,
    });
  }
})
.post(async (req, res) => {
try {
    const { _id, image, avatar, title, author, views, videoId } = req.body;
    const {userId}= req.params;
    let watchLater = await WatchLater.findOne({ userId });

    if (watchLater) {
      let videoIndex = watchLater.videos.find(video => video._id == _id);
      if (videoIndex != undefined) {
        return res.status(500).send("video already exists")
      } else {
        watchLater.videos.push({ _id, image, avatar, title, author, views, videoId });
      }
      watchLater = await watchLater.save();
      return res.status(201).send(watchLater);
    } else {
      const newWatchLater = await WatchLater.create({
        userId,
        videos:[{_id: _id, image:image, avatar:avatar, title:title, author:author, views:views, videoId: videoId}]
      });
      return res.status(201).send(newWatchLater);
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

router.route('/:userId/:videoId')
.get(async (req, res) => {
	try{
    const { video } = req;
    video.__v = undefined
		res.json({ success: true, video });
	}catch(error){
		console.error(error);
	}
})
.delete(async (req, res) => {
  try{
    const { videoId, userId} = req.params;
    let watchLater = await WatchLater.findOne({ userId });
    const videoExists = watchLater.videos.find(
      (video) => video._id == videoId
    )
    if(videoExists){
      watchLater.videos.remove(videoExists)
    }
    let watchLaterSaved = await watchLater.save();
		res.json({ success: true, watchLaterSaved})
	}catch(error){
		console.log("error occured", error);
	}
})

module.exports = router;