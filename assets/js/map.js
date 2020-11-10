document.addEventListener("DOMContentLoaded", function () {
    let mymap = L.map('map');

    L.tileLayer('https://bgmtile.kade.si/{z}/{x}/{y}.png', {
        attribution: '<a href="https://web.uni-plovdiv.net/vedrin/bgm/BGMountains_Legend.jpg" target="_blank">BGM Legend</a> | <a href="https://cart.uni-plovdiv.net/" target="_blank">CART Lab</a> | <a href="http://www.bgmountains.org/" target="_blank">BGM team</a> | Tiles © <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank">CC BY-SA 4.0</a>',
        maxZoom: 50
    }).addTo(mymap);

    function drawTrack(track) {
        let coordinates = track.points.map(p => [p.lat.toFixed(5), p.lon.toFixed(5)]);

        var polyline = L.polyline(coordinates, { weight: 6, color: 'darkred' }).addTo(mymap);

        // zoom the map to the polyline
        mymap.fitBounds(polyline.getBounds());
    }

    var trackPath = document.getElementById("map").getAttribute("data-gpx-file");

    fetch(trackPath)
        .then(function (response) {
            return response.text();
        }).then(function (gpxData) {
            let gpx = new gpxParser();
            gpx.parse(gpxData);

            document.getElementById("track-name").innerText = gpx.tracks[0].name;

            document.getElementById("totalDistance").innerText = (gpx.tracks[0].distance.total / 1000).toFixed(3);
            document.getElementById("totalDistanceNM").innerText = (gpx.tracks[0].distance.total / 1000 * 0.539956803).toFixed(3);

            document.getElementById("gpxDownload").innerText = trackPath;
            document.getElementById("gpxDownload").setAttribute("href", trackPath);

            gpx.tracks.forEach(element => {
                drawTrack(element);
            });
            //drawTrack(gpx.tracks[0]);
        });
});