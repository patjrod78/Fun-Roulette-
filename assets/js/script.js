var lng;
var lat;
var workAddress;
var key;
var queryURL;
var map;
var newLat;
var newLng;
var theaterAddress;
var date;
var commuteTimeQueryURL;
var commuteTime;
var theaterAddressArray = [];
var Array = [];


var searchTerm = document.querySelector("#srch-trm");
var searchButton = document.querySelector("#find-address");
var homeButton = document.querySelector("#home-button");
var buttonPage = document.querySelector(".button-page");
var searchPage = document.querySelector(".search-page");


searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  buttonPage.style.display = "none";
  searchPage.setAttribute("style", "display: block");
  getSearchResults();
});

homeButton.addEventListener("click", function (event) {
  event.preventDefault();
  buttonPage.style.display = "block";
  searchPage.style.display = "none";
});



function getSearchResults() {
  var listingAddressArray = [];
  var listingPriceArray = [];
  var commuteTimeArray = [];
  $("#response-cards").empty();
  var workAddress = $("#srch-trm").val();
  var key = "AIzaSyCi3dzreMrxNzmaHrULhs_SCJRMpzt8FbE";
  var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + workAddress + "&key=AIzaSyBif25LVSExkbgkV3IKS3LdU7u7A2U68ww"
  // Converting the searched address (workAddress) into lat lng and creating a marker on the map
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    var lat = response.results[0].geometry.location.lat;
    var lng = response.results[0].geometry.location.lng;
    var realtyData = $.parseJSON($.ajax({
      async: true,
      crossDomain: true,
      "url": "https://google-maps-geocoding.p.rapidapi.com/geocode/json?address=164%20Townsend%20St.%2C%20San%20Francisco%2C%20CA&language=en",
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "c326cc20aemsh6ccec9a57aeb847p16a896jsn0724a98c2811",
		"x-rapidapi-host": "google-maps-geocoding.p.rapidapi.com"
      },
      dataType: "json",
      async: false
    }).responseText); // This will wait until you get a response from the ajax request.

    for (i = 0; i <= realtyData.listings.length - 1; i += 1) {
      listingAddress = realtyData.listings[i].address;
      listingPrice = realtyData.listings[i].price;
      listingAddressArray.push(listingAddress);
      listingPriceArray.push(listingPrice);
      console.log(listingAddressArray);
      console.log(listingPriceArray);
    }

    for (i = 0; i <= listingAddressArray.length - 1; i += 1) {

      var divCard = $("<div>");
      divCard.attr("class", "card m-2");
      var imagTag = $("<img>");
      var linkTag = $("<a>");
      //Address of the link 
      linkTag.attr("class", "btn-warning")
      // address of the image to show 
      imagTag.attr("class", "card-img-top");
      // insert picture name from response 
      imagTag.attr("atl", "picture");
      linkTag.append(imagTag);
      divCard.append(linkTag);
      var divCardBody = $("<div>");
      divCardBody.attr("class", "card-body-listing");
      divCardBody.addClass("card-body")
      var h5text = $("<h5>").text(listingAddressArray[i]);
      h5text.attr("class", "card-title");
      var ptext = $("<p>").text("Price: $" + listingPriceArray[i]);
      ptext.attr("class", "card-text");
      divCardBody.append(h5text);
      divCardBody.append(ptext);
      divCard.append(divCardBody);
      //Appending to the div card
      $("#response-cards").append(divCard);
    }


    var service = new google.maps.DistanceMatrixService();
    var origins = listingAddressArray;
    console.log(origins);
    var destination = workAddress;
    service.getDistanceMatrix(
      {
        origins: origins,
        destinations: [destination],
        travelMode: 'DRIVING',
      }, callback)

    function callback(response) {
      $(".card-body-listing").each(function (index) {
        var ptext2 = $("<p>").text("Commute time: " + response.rows[index].elements[0].duration.text);
        ptext2.attr("class", "card-text");
        $(this).append(ptext2);
      })
    }

    console.log(lat);
    console.log(lng);
    var mymap = L.map('mapid').setView([lat, lng], 20);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2JhcnJvdzgyNSIsImEiOiJja2NhbXd5ZzUxd3IzMnJtcmJ4N2owZmtsIn0.vEUrS18G5gRKMxTVJ0V34A', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);

    var marker = L.marker([lat, lng]).addTo(mymap);
    marker.bindPopup("<b>Searched Address</b>").openPopup();

    for (i = 0; i <= theaterAddressArray.length; i += 1) {
      console.log(theaterAddressArray[i])
      var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + listingAddressArray[i] + "&key=AIzaSyBif25LVSExkbgkV3IKS3LdU7u7A2U68ww"
      // Converting each theater request into lat lng and creating a marker on the map
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function (response) {
        var lat = response.results[0].geometry.location.lat;
        var lng = response.results[0].geometry.location.lng;
        var marker = L.marker([lat, lng]).addTo(mymap);
      })
    }

  })
}