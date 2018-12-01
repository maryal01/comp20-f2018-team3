const express = require('express');
const app = express();
const path = require("path");
var request = require('request');
var querystring = require('querystring');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var spotifyWebAPI = require('spotify-web-api-node');

var client_id = "f4197e7c7e16424796aeddab09673434";
var client_secret = "f7d26f4a74f44a439b571086aabf2934";

const PORT = process.env.PORT || 5000

app.use(express.static(__dirname + '/Script'))
   .use(cors())
   .use(cookieParser());

app.get('/',
(req, res) => {
  res.sendFile('/View/homepage.html', { root: __dirname });
});

app.get("/about",
(req,res) => {
  res.sendFile('/View/about.html', { root: __dirname });
});

app.get("/detection",
(req,res) => {
  res.sendFile('/View/detection.html', { root: __dirname });
});

app.get('/login', (req, res) => {
  var credentials = {
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: 'http://localhost.com:5000/homepage/'
  };

  var spotifyApi = new spotifyWebAPI(credentials);
  spotifyApi.clientCredentialsGrant().then(
    (data) => {
      console.log(data.body['access token']);
      spotifyApi.setAccessToken(data.body['access_token']);

      spotifyApi.searchTracks('Love')
        .then(function(data) {
          res.send(data.body.tracks.items[0]);
        }, function(err) {
          console.error(err);
        });
    },
    (err) => {console.log('Something went wrong when retrieving an access token', err.message); });
});

app.post("/catchEmotion", (req, res) => {
  console.log(req.body);
  res.send("Recieved");
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
