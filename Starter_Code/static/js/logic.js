// create a map
const map = L.map('map').setView([0, 0], 2);

//add base layer using openstreetmap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

//load your GeoJSON data
fetch('all_week.geojson')
    .then(response => response.json())
    .then(data => {
        //create GeoJson layer
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: feature.properties.mag * 5, //adjust the size based on earthquakes
                    fillColor: getColor(feature.geometry.coordinates[2]), //color based on depth
                    color:'green',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function (feature, layer){
                // bind a popup with earthquake info
                layer.bindPopup('<h3>' + feature.properties.place + '</h3>' +
                    '<p>Magnitude:' + feature.properties.mag + '</p' +
                    '<p>Depth:' + feature.geometry.coordinates[2] + ' km</p' +
                    '<p><a href=' + feature.properties.url + '" target=" _blank">More info</a></p>');
            }
        }).addTo(map);

        //create legend
        const legend = L.control({ position: 'bottomright'});
        legend.onAdd = function (map) {
            const div = L.DomUtil.create ('div', 'info legend');
            const depthLevels = [0, 10, 30, 70, 100];
            const labels = [];

            for (let i = 0; i < depthLevels.length; i++) {
                const from = depthLevels[i];
                const to = depthLevels[i + 1];
                labels.push(
                    '<i style="background:' + getColor(from + 1) + '"></i>' +
                    from + (to ? '&ndash;' + to : '+') + 'km'
                );
            }

            div.innerHTML = labels.join('<br>');
            return div;
        };
        legend.addTo(map);
    });

//define a function for color based on depth
function getColor(depth) {
    const colors = ['#33FF33', '#33FF00', '#FFCC33', '#FF9900', '#FF3300', '#FF0000'];
    for (let i = 0; i< colors.length; i++){
        if (depth <= 10 * (i +1)) {
            return colors[i];
        }
    }
}