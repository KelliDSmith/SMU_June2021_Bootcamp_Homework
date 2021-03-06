// build URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// geojson
var tectonic_plates_url = "static/data/PB2002_boundaries.json";

$(document).ready(function() {
    // AJAX
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json",
        dataType: "json",
        success: function(data) {

            // NESTED AJAX
            $.ajax({
                type: "GET",
                url: tectonic_plates_url,
                contentType: "application/json",
                dataType: "json",
                success: function(tect_data) {
                    console.log(data);
                    console.log(tect_data);
                    createMap(data, tect_data);

                },
                error: function(data) {
                    console.log("YOU BROKE IT!!");
                },
                complete: function(data) {
                    console.log("Request finished");
                }
            });
        },
        error: function(data) {
            console.log("YOU BROKE IT!!");
        },
        complete: function(data) {
            console.log("Request finished");
        }
    });
});


function createMap(data, tect_data) {
    // Create the base layers.
    var dark_layer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/dark-v10',
        accessToken: API_KEY
    });

    var light_layer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/light-v10',
        accessToken: API_KEY
    });

    // Create a baseMaps object to contain the streetmap and the darkmap.
    var baseMaps = {
        "Dark": dark_layer,
        "Light": light_layer
    };

    // DO WORK AND CREATE THE OVERLAY LAYERS
    let features = data.features;
    let plateLayer = L.geoJson(tect_data, {
        // Passing in our style object
        style: function(feature) {
            return {
                color: "blueviolet",
                weight: 4
            };
        }
    });

    // LOOP
    var earthquakeMarkers = L.markerClusterGroup();
    var circleArray = [];
    for (var i = 0; i < features.length; i++) {
        var location = features[i].geometry;

        if (location) {

            let marker = L.marker([location.coordinates[1], location.coordinates[0]]);
            marker.bindPopup(`<h3>${features[i].properties.place}</h3><hr>
                            <p> Magnitude: ${features[i].properties.mag}</p><p>${new Date(features[i].properties.time)}</p>`);
            earthquakeMarkers.addLayer(marker);

            // create circles
            let circle = L.circle([location.coordinates[1], location.coordinates[0]], {
                fillOpacity: 0.75,
                color: Color(location.coordinates[2]),
                fillColor: Color(location.coordinates[2]),
                // Setting our circle's radius to equal the output of our markerSize() function:
                // This will make our marker's size proportionate to its population.
                radius: Radius(features[i].properties.mag)
            }).bindPopup(`<h3>${features[i].properties.place}</h3><hr>
                        <p> Magnitude: ${features[i].properties.mag}</p><p>${new Date(features[i].properties.time)}</p>`);

            circleArray.push(circle);
        }
    }

    // Create  layer groups for circles
    var circleLayer = L.layerGroup(circleArray);

    // Create an overlayMaps object to contain the "State Population" and "City Population" layers
    var overlayMaps = {
        "Marker Clusters": earthquakeMarkers,
        // "Earthquakes": geoLayer,
        "Circles": circleLayer,
        "Plates": plateLayer
    };

    // Modify the map so that it has the streetmap, states, and cities layers
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [dark_layer, circleLayer]
    });

    // Create a layer control that contains our baseMaps and overlayMaps, and add them to the map.
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    // CREATE LEGEND
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');

        let legend_html = `<i class="circle" style='background: #98ee00'></i><span>-10-10</span><br>
        <i class="circle" style='background: #d4ee00'></i><span>10-30</span><br>
        <i class="circle" style='background: #eecc00'></i><span>30-50</span><br>
        <i class="circle" style='background: #ee9c00'></i><span>50-70</span><br>
        <i class="circle" style='background: #ea822c'></i><span>70-90</span><br>
        <i class="circle" style='background: #ea2c2c'></i><span>90+</span>`;

        div.innerHTML = legend_html;
        return div;
    }
    legend.addTo(myMap);
}

// Radius Function
function Radius(magnitude) {
    // Adjust the radius
    return magnitude * 25000;
}

// Color Function
function Color(depth) {
    let rtnColor = "#98ee00";

    // Conditionals for country points
    if (depth > 90) {
        rtnColor = "#ea2c2c";
    } else if (depth > 70) {
        rtnColor = "#ea822c";
    } else if (depth > 50) {
        rtnColor = "#ee9c00";
    } else if (depth > 30) {
        rtnColor = "#eecc00";
    } else if (depth > 10) {
        rtnColor = "#d4ee00"
    } else {
        rtnColor = "#98ee00"
    }
    return rtnColor;
}


