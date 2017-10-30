$(document).ready(() => {

  $("#search-button").on("click", function (){
    var $input = $("#search-input").val();
    Trackster.searchTracksByTitle($input);
  });
  $("#search-input").on("keypress", function (event) {
    if (event.keyCode == 13) {
      var $input = $("#search-input").val();
      Trackster.searchTracksByTitle($input);
    };
  });
  $(".fa-arrow-right").on("click", function (event) {
    $(this).addClass("rotate");
    if (currentTrackList.length == 0){$(this).removeClass("rotate")}
    $(this).parents().siblings().children(".fa-arrow-right").removeClass("rotate");
    Trackster.sortTracksByChoice(this);
  });
});

const API_KEY = "23fc2d70b810c7ca9375ea738cc55e92";
// https://www.last.fm/api/show/track.search website for API methods
var Trackster = {};
var currentTrackList = [];

/*
  Given a search term as a string, query the LastFM API.
  Render the tracks given in the API query response.
*/
Trackster.searchTracksByTitle = function(title) {
  var stringURL = "http://ws.audioscrobbler.com/2.0/?method=track.search&track=" + title + "&api_key=" + API_KEY + "&format=json";
    $.ajax({
      url: stringURL,
      datatype: 'json',
      success: function (data) {
        var trackList = data.results.trackmatches.track;
        Trackster.renderTracks(trackList);
      }
    });
};
/*
  Given an array of track data, create the HTML for a Bootstrap row for each.
  Append each "row" to the container in the body to display all tracks.
*/
Trackster.renderTracks = function(trackList) {
  $("#search-results").empty();
  for (track in trackList) {
    var trackURL = trackList[track].url;
    var trackName = trackList[track].name;
    var trackArtist = trackList[track].artist;
    var trackalbumLink = trackList[track].image[1]["#text"];
    var trackListeners = numeral(trackList[track].listeners).format('0,0');
    var $resultRow = "<div class='row search-result basebox'>"
      + "<a href='" + trackURL + "' class='col-md-1' target='_blank'><span class='fa fa-play-circle-o'></span></a>"
      + "<span class='col-md-3'>" + trackName + "</span>"
      + "<span class='col-md-3'>" + trackArtist + "</span>"
      + "<span class='col-md-3'><img src='" + trackalbumLink + "'></img></span>"
      + "<span class='col-md-2'>" + trackListeners + "</span>";
    $("#search-results").append($resultRow);
  }
  currentTrackList = trackList;

};
/*
  given an HTML Element representing the sort type, sorts the rendered List by the argument
  and renders them again
*/
Trackster.sortTracksByChoice = function(choice) {
  var searchItem = choice.getAttribute("id");
  switch (searchItem) {
    case "songFilter":
      currentTrackList.sort(function(a, b){
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      });
      break;
    case "artistFilter":
      currentTrackList.sort(function(a, b){
        var x = a.artist.toLowerCase();
        var y = b.artist.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      });
      break;
    case "popularityFilter":
      currentTrackList.sort(function(a, b){
        return b.listeners - a.listeners;
      });
      break;
    default:
  }
  Trackster.renderTracks(currentTrackList);
};
