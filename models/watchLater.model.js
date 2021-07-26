const mongoose = require("mongoose");
const { Schema } = mongoose;

const WatchLaterSchema = new Schema({ 
  userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
  videos:[
    {
      _id:{
        type: Schema.Types.ObjectId,
        ref: "Videos"
      },
      image:{
        type:String,
        ref:"Videos"
      },
      avatar:{
        type:String,
        ref:"Videos"
      },
      title:{
        type:String,
        ref:"Videos"
      }, 
      author:{
       type:String,
        ref:"Videos" 
      }, 
      views:{
        type:String,
        ref:"Videos"
      },
      videoId:{
        type:String,
        ref:"Videos"
      }

    }
  ]
});

const WatchLater = mongoose.model("WatchLater", WatchLaterSchema);
module.exports = { WatchLater }