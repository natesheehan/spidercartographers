import { drawChart } from './mapBoxChart.js';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hleW5lLWNhbXBiZWxsIiwiYSI6ImNrOHMxYW9wYTA0OWkzZXBhenJyemFsbnIifQ.cXgp6qu6dAmDTAh-ID2M3g';

var map = new mapboxgl.Map({
    container: 'map_container',
    style: 'mapbox://styles/cheyne-campbell/ck966jun93urx1iqlhlheiknl',
    center: [-2, 53],
    zoom: 5.8
});

// Limit searchable extent to Great Britian
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        countries: 'gb'
    })
);

// Disable zoom on double click
map.doubleClickZoom.disable();

// Web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBB8J3_bgG7AYKrmYthHqzD3gAHNUk925A",
  authDomain: "spidercartographers.firebaseapp.com",
  databaseURL: "https://spidercartographers.firebaseio.com",
  projectId: "spidercartographers",
  storageBucket: "spidercartographers.appspot.com",
  messagingSenderId: "1018443119846",
  appId: "1:1018443119846:web:2edfb7354e138727694f27",
  measurementId: "G-RQHR5T16XR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.database();

// Read in MSOA spatial data using ajax call
// var msoaData = $.ajax({
//   url: "https://opendata.arcgis.com/datasets/29fdaa2efced40378ce8173b411aeb0e_2.geojson"
//   }).done(function(msoas){

    // Check that data was read in correctly
    const msoas = "assets/data/msoas.geojson"
    console.log(msoas);

    // When map loads...
    map.on('load', function() {

        // Load the MSOA geojson data
        map.addSource('states', {
            'type': 'geojson',
            'data': msoas,
            'generateId': true
        });

        // Add centroids
        map.addSource('centroids', {
          'type': 'geojson',
          'data': 'assets/MSOA_Centroids.geojson'
        });

        // Add MSOA polygons - opacity changes upon hover
        map.addLayer({
            'id': 'state-fills',
            'type': 'fill',
            'source': 'states',
            'layout': {},
            'paint': {
              // its based on a file where cluster numbers are 0-4 not 1-5, so 0 is cluster no 1, 1 is cluster no 2 and so on
              'fill-color': ['match',
                    ['get', 'log_zscore_kmeans_cluster'],
                    0,'#ffa372',
                    1,'#ed6663',
                    2,'#37a583',
                    3,'#186da0',
                    4,'#fff059',
                    /* other */ 'black'],
              'fill-opacity': [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  1,
                  0.7
              ]
            }
        });

        // Add MSOA outlines
        map.addLayer({
            'id': 'state-borders',
            'type': 'line',
            'source': 'states',
            'layout': {},
            'paint': {
                'line-color': '#627BC1',
                'line-width': 0
            }
        });

        // Get HTML elements that will change when an MSOA is clicked on
        var idDisplay = document.getElementById('msoaId');
        var nameDisplay = document.getElementById('msoaName');
        var clusterNumberDisplay = document.getElementById('clusterNumber');

        ///////////////////////////////////////////////////////////////////////////

        // Global variables
        var msoaID = null;
        var msoaIDClick = null;

        // When the mouse hovers over the MSOA, change the opacity
        map.on('mousemove', 'state-fills', function(e) {

          map.getCanvas().style.cursor = 'pointer';

          // Check that the feature exits
          if (e.features.length > 0) {
            if (msoaID) {
              map.setFeatureState(
                { source: 'states', id: msoaID },
                { hover: false }
              );
            }

            msoaID = e.features[0].id;

            map.setFeatureState(
              { source: 'states', id: msoaID },
              { hover: true }
            );

            ///////////////////////////////////////////////////////////////////////////

            // When the MSOA is clicked on, change data and allow option to display flows
            map.on('click', 'state-fills', (e1) => {

              // Check that the feature exits
              if (e1.features.length > 0) {

                  if (msoaID) {
                    console.log("doing the thing");
                  }

                  // msoaIDClick = e1.features[0].geometry.coordinates;
                  msoaID = e1.features[0].id;

                  // When a new MSOA is clicked on, turn off flows switch
                  document.getElementById("switch").checked = false;

                  // Set variables equal to the current, clicked feature's info
                  var idOfMsoa = e1.features[0].properties.objectid;
                  var nameOfMsoa = e1.features[0].properties.msoa11nm;
                  var ref = db.ref(e1.features[0].properties.msoa11cd);

                  // Get Firebase data
                  ref.on('value', getData, errData);

                  var currentObj;
                  function getData(data){
                    currentObj = data.val();
                  }

                  function errData(data){
                    console.log("ERROR");
                    console.log(err);
                  }

                  // Display the id, name and cluster in the sidebar
                  idDisplay.textContent = idOfMsoa;
                  nameDisplay.textContent = nameOfMsoa;
                  clusterNumberDisplay.textContent = currentObj.log_zscore_kmeans_cluster;

                  // Data for the chart
                  const a = currentObj.work_from_home_perc;
                  const b = currentObj.on_foot_perc;
                  const c = currentObj.bicycle_perc;
                  const d = currentObj.car_perc;
                  const e = currentObj.bus_perc;
                  const f = currentObj.train_perc;
                  const g = currentObj.underground_metro_perc;
                  drawChart(a,b,c,d,e,f,g)

              } // end of feature length - clicked
            }); // end of on click
          } // end of feature length - hover
        }); // end of on hover

        ///////////////////////////////////////////////////////////////////////////

        // When the mouse leaves the MSOA, return opacity to normal
        map.on('mouseleave', 'state-fills', function() {

          if (msoaID) {
            map.setFeatureState(
              { source: 'states', id: msoaID},
              { hover: false }
            );
          }
          msoaID = null;
        });

      ///////////////////////////////////////////////////////////////////////////

        // If flows switch is toggled on
        $('#switch').click(function(){
            if($(this).is(':checked')){

                console.log('It has been checked!');

                //var polygon = msoaIDClick;
                // Get MSOA centroid
                // var marker = new mapboxgl.Marker(polygon.getBounds().getCenter()).addTo(map);

            } else {
                console.log('Our checkbox is not checked!');
            }
        }); // end of flows switch

    }); // end of on load
  // }); // end of ajax
