const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const cors = require("cors");
const { initializeDBConnection } = require("./db/db.connect.js")
const videos = require("./routes/videos.router.js")
const watchLater = require("./routes/watchLater.router.js")
const playlists = require("./routes/playlist.router")
const authRoute = require("./routes/auth.router");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 3000;

initializeDBConnection();

app.use("/videos", videos);
app.use("/watchLater", watchLater)
app.use("/playlists", playlists)
app.use("/user",authRoute )

app.get('/', (request, response) => {
  response.json({ hello: "world"})
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "route not found on server, please check"})
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "error occured, see the errMessage key for more details", errorMessage: err.message})
})

app.listen(PORT, () => {
  console.log('server started on port: ', PORT);
});