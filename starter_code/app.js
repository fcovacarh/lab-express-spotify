const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require('body-parser')
require("dotenv").config();

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = process.env.API_CLIENT,
  clientSecret = process.env.API_SECRET;

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:
app.get('/', (req, res) => {
    res.render('index');
});

app.post("/artists", (req, res) => {  

  spotifyApi
    .searchArtists(req.body.name)
    .then(data => {
      let artists = data.body.artists.items;
      //res.json(artists);
      res.render('artists', {artists});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res) => {
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
        let albums = data.body.items;
        console.log(albums[0].id);
        res.render('albums', {albums});
    })
    .catch(err => {
        console.log(err)
    })
});

app.get("/tracks/:albumId", (req, res) => {
    spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
        let tracks = data.body.items;
        res.render('tracks', {tracks});
    })
    .catch(err => {
        console.log(err)
    })
});

app.listen(process.env.PORT, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
