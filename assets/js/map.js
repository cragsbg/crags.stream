document.addEventListener("DOMContentLoaded", function () {

    var bgmTileLayer = L.tileLayer('https://bgmtile.kade.si/{z}/{x}/{y}.png', {
        attribution: '<a href="https://web.uni-plovdiv.net/vedrin/bgm/BGMountains_Legend.jpg" target="_blank">BGM Legend</a> | <a href="https://cart.uni-plovdiv.net/" target="_blank">CART Lab</a> | <a href="http://www.bgmountains.org/" target="_blank">BGM team</a> | Tiles © <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank">CC BY-SA 4.0</a>',
        maxZoom: 50
    });

    var osmTileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ['a', 'b', 'c']
    });

    let myMap = L.map('map', {
        layers: [osmTileLayer, bgmTileLayer]
    });

    var baseMaps = {
        "Open Street Map": osmTileLayer,
        "BG Mountains Map": bgmTileLayer
    };

    L.control.layers(baseMaps).addTo(myMap);

    var trackPath = document.getElementById("map").getAttribute("data-gpx-file");
    var trackIndex = document.getElementById("map").getAttribute("data-gpx-track-index");

    fetch(trackPath)
        .then(function (response) {
            return response.text();
        }).then(function (gpxData) {
            let gpx = new gpxParser();
            gpx.parse(gpxData);

            document.getElementById("track-name").innerText = gpx.tracks[trackIndex].name;

            document.getElementById("totalDistance").innerText = (gpx.tracks[trackIndex].distance.total / 1000).toFixed(3);
            document.getElementById("totalDistanceNM").innerText = (gpx.tracks[trackIndex].distance.total / 1000 * 0.539956803).toFixed(3);

            document.getElementById("gpxDownload").innerText = trackPath;
            document.getElementById("gpxDownload").setAttribute("href", trackPath);

            // draw track
            let coordinates = gpx.tracks[trackIndex].points.map(p => [p.lat.toFixed(5), p.lon.toFixed(5)]);
            var polyline = L.polyline(coordinates, { weight: 6, color: 'darkred' }).addTo(myMap);
            // zoom the map to the polyline
            myMap.fitBounds(polyline.getBounds());

            // draw waypoints
            gpx.waypoints.forEach(waypoint => {
                L.marker([waypoint.lat, waypoint.lon])
                    .bindPopup(waypoint.name)
                    .addTo(myMap);
            });
        });
});