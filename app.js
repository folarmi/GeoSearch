//QuerySelectors
const humidityValue = document.getElementById('humidity');
const windSpeedValue = document.getElementById('wind-speed');
const pressureValue = document.getElementById('pressure');
const maxTempValue = document.getElementById('max-temp');
const temperatureValue = document.getElementById('temperature');
const weatherDescription = document.getElementById("weather-des")
const nameOfCity = document.getElementById('name-of-city')
const weatherImage = document.getElementById('banner-img')

// Google maps
function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      // console.log(place.photos[1][0])
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));
      

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        console.log(place)
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}


//Get Weather
document.getElementById('show-weather').addEventListener('click', getWeather);

function getWeather () {
  const cityName = document.getElementById('pac-input').value;
    var api = ' https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&APPID=78c41b3ef7b008eb035fd1e2cfa87696';

    fetch(api)
   .then((res) => res.json())
   .then((data) => {
      var humidity = data.main.humidity;
      var windSpeed = data.wind.speed;
      var Temperature = Math.round(data.main.temp - 273.15); 
      var weather = data.weather[0].description;
      var maxTemp= Math.round(data.main.temp_max - 273.15)
      var pressure = data.main.pressure;
      var name = data.name;
      var iconCode = data.weather[0].icon;
      var iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";

      //To get Date in Js
      var date = new Date();
      var currentDay = date.getDate();
      var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var currentMonth = months[date.getMonth()];

      // Posts to the DOM
      nameOfCity.innerHTML = name;
      humidityValue.innerHTML = humidity;
      windSpeedValue.innerHTML = windSpeed + "km/hr";
      pressureValue.innerHTML = pressure;
      maxTempValue.innerHTML = maxTemp;
      temperatureValue.innerHTML = Temperature + "&#8451";
      weatherDescription.innerHTML = currentMonth +  " " + currentDay + " | " + weather;
      weatherImage.setAttribute('src',iconurl)
})
}