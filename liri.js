require("dotenv").config();

var moment = require("moment");
var axios = require("axios");
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fs = require("fs");


var whatToDo = process.argv[2];
var input = process.argv.slice(3).join(" ");

console.log(whatToDo);

runLiri(whatToDo);

function runLiri(whatToDo) {

  if (whatToDo === "concert-this") {
    concertThis(input);
  }
  if (whatToDo === "spotify-this-song") {
    spotifyThis(input);
  }
  if (whatToDo === "movie-this") {
    movieThis(input);
  }
  if (whatToDo === "do-what-it-says") {
    doIt();
  }
}


function concertThis(input) {

  console.log(input);
  axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp").then(
    function (response) {

      // console.log("\n---------------------------------------------------\n")
      // console.log(response.data);
      response.data.forEach(concert => {
        console.log(concert.venue.name)
        console.log(concert.venue.city + ", " + concert.venue.region)
        console.log(concert.datetime)
        console.log("---------------------------")
      })
      // console.log("\n---------------------------------------------------\n")
    }
  );
}


function spotifyThis(input) {

  if (!input) {
    input = "The Sign";
  }
  spotify.search({ type: 'track', query: input }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    console.log("\n---------------------------------------------------\n")
    console.log("Artist: " + data.tracks.items[0].artists[0].name)
    console.log("Song: " + data.tracks.items[0].name)
    console.log("Preview: " + data.tracks.items[3].preview_url)
    console.log("Album: " + data.tracks.items[0].album.name);
    console.log("\n---------------------------------------------------\n")

  });
}


function movieThis(input) {

  if (!input) {
    movie = "mr nobody";
  }

  axios.get("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy").then(
    function (response) {

      console.log("\n---------------------------------------------------\n")
      console.log("Title: " + response.data.Title);
      console.log("Year: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);
      console.log("Rotten Tomatoes: " + response.data.Ratings[1]);
      console.log("Country: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Movie Plot: " + response.data.Plot);
      console.log("Actors: " + response.data.Actors);
      console.log("\n---------------------------------------------------\n")
    }
  )
};

function doIt() {

  fs.readFile("random.txt", "utf8", function (error, data) {
    var arr = data.split(",");
    var task = arr[0];
    var input = arr[1].split('"').join('');

console.log(arr);
console.log(task);
console.log(input);

    if (error) {
      return console.log(error);
    }

    if (task === "concert-this"){
      concertThis(input);
    }
    if (task === "spotify-this-song"){
      spotifyThis(input);
    }
    if (task === "movie-this"){
      movieThis(input);
    }

  });
}
