const express = require("express");
const router = express.Router();
const { Playlist } = require("../models/playlist.model");
const { Videos } = require("../models/videos.model");
const { TubeUser } = require("../models/user.model");

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
	try{
    const {userId} = req.params;
    const user = await TubeUser.findById({ _id:userId });
		let playlists = await Playlist.find({userId});
		res.json({success: true, playlists});
	}catch(error){
		console.log(error);
	}
})
.post(async (req, res) => {
	try{
    const {userId}= req.params;
    const {name} = req.body;
     const newPlaylist = await Playlist.create([{
        userId,
        name:name,
        videos: []
      }]);
		res.json({success: true, newPlaylist});
	}catch(error){
		console.error(error);
	}
})

router.param("playlistId", async (req, res, next, playlistId) => {
	try{
		const playlist = await Playlist.findById(playlistId)

		if(!playlist){
			return res.status(400).json({success: false, message: "error in getting playlist"})
		}
		req.playlist = playlist;
		next();
	}catch{
		res.status(400).json({success: false, message: "playlist not found!"})
	}	
})

router.route('/:userId/:playlistId')
.get(async (req, res) => {
	try{
		const { userId, playlistId } = req.params;
    const user = await TubeUser.findById({ _id:userId });
    let playlist = await Playlist.findById(playlistId);
		res.json({success: true, playlist});
	}catch(error){
		console.log(error);
	}
})
.delete(async (req, res) => {
	try{
		const { playlist } = req;
		await playlist.remove();
		res.json({ success: true, playlist});
	}catch(error){
		console.log(error);
	}
})

router.route("/:userId/:playlistId/:name")
.get(async (req, res) => {
	try{
		const { _id } = req.params;
    let videos = await Videos.findById(_id);
    videos.__v = undefined;
		res.json({success: true, videos});
	}catch(error){
		console.log(error);
	}
})
.post( async (req, res) => {
try {
    const { _id, image, avatar, title, author, views, videoId } = req.body;
    const {userId, playlistId, name}= req.params;
    let playlist = await Playlist.findOne({ name });
    if (playlist) {
      if(playlist.videos.includes(_id)){
        res.status(500).send("video already exists")
      }
      else {
        playlist.videos.push({ _id, image, avatar, title, author, views, videoId });
      }
      console.log(playlist)
    playlist = await playlist.save();
    res.status(201).send(playlist);
    } else{
      res.status(401).send("playlist not found")
    }
  } catch (err) {
    console.log(err)
  }
})

router.route("/:userId/:playlistId/:videoId")
.delete( async(req, res) => {
  try{
    const {videoId, playlistId}= req.params;
    const playlist = await Playlist.findById(playlistId)
    const videoExists = playlist.videos.find(
      (video) => video.videoId == videoId
    )
    if(videoExists){
      playlist.videos.remove(videoExists)
    }
    let playlistSaved = await playlist.save();
		res.json({ success: true, videoExists})
	}catch(error){
		console.log("error occured", error);
	}
})

module.exports = router;