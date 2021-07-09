const mongoose = require("mongoose")

async function initializeDBConnection() {
  const DB_CONNECT = process.env['DB_CONNECT']
  try{
    mongoose.connect(DB_CONNECT,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
  })
  
  console.log("successfully connected to db");
  } catch(error){
    console.error("mongoose connection failed...", error)
  }
}

module.exports = { initializeDBConnection }