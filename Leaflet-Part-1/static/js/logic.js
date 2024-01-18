
//store the URL 
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Add a Leaflet tile layer.
let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create a Leaflet map object.
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [streetMap]
});


//define basemaps as the streetmap
let baseMaps = {
    "streets": streetMap
};

//define the earthquake layergroup and tectonic plate layergroups for the map
let earthquake_info = new L.LayerGroup();


//define the overlays and link the layergroups to separate overlays
let overlays = {
    "Earthquakes": earthquake_info,
};

//add a control layer and pass in baseMaps and overlays
L.control.layers(baseMaps, overlays).addTo(myMap);

//this styleInfo function will dictate the stying for all of the earthquake points on the map
function colorInfo(feature) {
    return {
        color: 'white',
        radius: radius(feature.properties.mag), 
        fillColor: color(feature.geometry.coordinates[2]),
        fillOpacity: 0.5
    }
};

//define a function to choose the fillColor of the earthquake based on earthquake depth
function color(depth) {
    if (depth <= 10) return "cyan";
    else if (depth > 10 & depth <= 25) return "orange";
    else if (depth > 25 & depth <= 40) return "yellow";
    else if (depth > 40 & depth <= 55) return "green";
    else if (depth > 55 & depth <= 70) return "blue";
    else return "brown";
};

//define a function to determine the radius of each earthquake marker
function radius(mag) {
    return mag*10;
};

d3.json(url).then(function (data) { //pull the earthquake JSON data with d3
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) { 
            return L.circleMarker(latlon).bindPopup(feature.properties.title); 
        },
        style: colorInfo //style the CircleMarker with the styleInfo function as defined above
    }).addTo(earthquake_info); 
    earthquake_info.addTo(myMap);


});
//create legend
let legend = L.control({ position: "bottomright" });
legend.onAdd = function(myMap) {
    let div = L.DomUtil.create("div", "legend");
       div.innerHTML += "<h4>Legend</h4>";
       div.innerHTML += '<i style="background: cyan"></i><span>(0 < 10)</span><br>';
       div.innerHTML += '<i style="background: orange"></i>(10 - 25)</span><br>';
       div.innerHTML += '<i style="background: yellow"></i>(25 - 40)</span><br>';
       div.innerHTML += '<i style="background: green"></i>(40 - 55)</span><br>';
       div.innerHTML += '<i style="background: blue"></i>(55 - 70)</span><br>';
       div.innerHTML += '<i style="background: brown"></i>(70 +)</span><br>';
  
    return div;
  };
  //add the legend to the map
  legend.addTo(myMap);
