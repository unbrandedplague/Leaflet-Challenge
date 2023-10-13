// json
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// leaflet map
const map = L.map('map').setView([0, 0], 2);

// load and add GeoJson layer map
const earthquake = L.geoJSON.ajax(url, {
    pointToLayer: function(feature, latlng){
        // customize marker based on magnitude and depth
        const radius = feature.properties.mag * 5;
        const depth = feature.geometry.coordinates[2];
        const color = depthColor(depth);

        return L.circle(latlng, {
            radius: radius,
            color: 'gray', //outline
            fillColor: color, 
            fillOpacity: 0.7
        }).bindPopup(
            `Magnitude: ${feature.properties.mag}<br>Depth: ${depth} km`
        );
    }
}).addTo(map);

//add GeoJson layer to map
earthquake.addTo(map);

//define color based on depth
function depthColor(depth) {
    if (depth < 10) return 'steelblue';
    else if (depth < 30) return 'lightcoral';
    else if (depth < 70) return 'yellow';
    else return 'red';
}

// add legend to map
const legend = L.control({ position: 'bottomright'});

legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'info legend');
    const depths = [-10, 10, 30, 70];
    const labels = []

    for (let i = 0; i < depths.length; i++){
        div.innerHTML += `<i style="background:${depthColor(depths[i] + 1)}"></i>${depths[i] + 1}${depths[i +1] ? `&ndash;${depths[i +1]}<br>` : '+'}`;
    }

    return div;

};

legend.addTo(map);

// set initial view and add a tile layer 
map.setView([0,0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);