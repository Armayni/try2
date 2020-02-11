var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery Â© <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var map = L.map("map", {
  center: [40.73, -74.0059],
  zoom: 4,
  layers: [
    lightmap
  ]
});

lightmap.addTo(map);
var earthquakes = new L.LayerGroup();

var overlays = {
  "Earthquakes": earthquakes
};

L.control.layers(null, overlays).addTo(map);



d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson", function (data) {

  function styling(feature) {
    return {
      opacity: 0.5,
      fillOpacity: 0.8,
      fillColor: circelColor(feature.properties.mag),
      color: "#000",
      radius: Radius(feature.properties.mag),

    };
  }





  function Radius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styling,
    onEachFeature: function (feature, layer) {
      layer.bindPopup("Title: " + feature.properties.title + "<br>Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }

  }).addTo(earthquakes);

  earthquakes.addTo(map);
  var info = L.control({
    position: "bottomright"
  });
  info.onAdd = function () {
    var div = L
      .DomUtil
      .create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#1a0000",
      "#ff0000",
      "#ff1a1a",
      "#ff3333",
      "#ff9999",
      "#ffffff"
    ];


    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + circelColor(grades[i] + 1) + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };


  function circelColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#1a0000";
      case magnitude > 4:
        return "#ff0000";
      case magnitude > 3:
        return "#ff1a1a";
      case magnitude > 2:
        return "#ff3333";
      case magnitude > 1:
        return "#ff9999";
      default:
        return "#ffffff";
    }
  }
  info.addTo(map);

});