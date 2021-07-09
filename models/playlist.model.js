const mongoose = require("mongoose");
const { Schema } = mongoose;

const PlaylistSchema = new Schema({ 
  userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
  name: { type: String, required: true },
  videos: [
    {
      _id: {
        type:Schema.Types.ObjectId ,
          ref: "Videos"
      },
      avatar: {
          type:String,
          ref:"Videos"
        },
      title:{
        type: String,
        ref:"Videos"
      },
      author: {
          type:String,
          ref:"Videos"
      },
      image: {
          type:String,
          ref:"Videos"
      },
      description: {
          type:String,
          ref:"Videos"
      },
      videoId:{
          type: String,
          ref: "Videos"
      }
    }
]});

const Playlist = mongoose.model("Playlist", PlaylistSchema);
module.exports = { Playlist }