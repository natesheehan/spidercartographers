import { drawChart } from './mapBoxChart.js';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hleW5lLWNhbXBiZWxsIiwiYSI6ImNrOHMxYW9wYTA0OWkzZXBhenJyemFsbnIifQ.cXgp6qu6dAmDTAh-ID2M3g';

var map = new mapboxgl.Map({
    container: 'map_container',
    style: 'mapbox://styles/cheyne-campbell/ck966jun93urx1iqlhlheiknl',
    center: [-4.0, 55],
    zoom: 5.5
});

map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        countries: 'gb'
    })
);

// Your web app's Firebase configuration
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

// variable to store MSOA geojson
// var msoas;

// fetch the geojson data directly - may not work on some browsers but that is a problem for another day
//fetch('https://opendata.arcgis.com/datasets/29fdaa2efced40378ce8173b411aeb0e_2.geojson')
//  .then(response => response.json())
//  .then(data => msoas = data)
  // can remove console.log step - used for checking what's going on

// Read in MSOA spatial data 
var msoaData = $.ajax({
  url: "https://opendata.arcgis.com/datasets/29fdaa2efced40378ce8173b411aeb0e_2.geojson"
  }).done(function(msoas){


    /////////////////////////////////// CLUSTER LOOK UP ARRAY //////////////////////////////
    // Check that it worked 
    // console.log(msoas);

    async function findClusters() {
      // Create array for looking up clusters
      var clusterLookUp = {}; 
    
      msoas.features.forEach(entry => {
          
          // Get MSOA ID of feature
          var msoaID = entry.properties.msoa11cd;
          // console.log(msoaID);

          // Reference Firebase data 
          var msoaRef = db.ref(msoaID);

          msoaRef.once('value', function(data) {
              var clusterID = data.val().log_zscore_kmeans_cluster; 
              // clusterLookUp[msoaID] = clusterID;
              entry.properties = {...entry.properties, clusterID: clusterID} //that adds another property of clusterID to msoas
              // console.log(clusterLookUp);
          });
    
      })
      // console.log(msoas)
    }
   
    /////////////////////////////////// ^ CLUSTER LOOK UP ARRAY ^ //////////////////////////////
  
    findClusters();


    map.on('load', function() {
        // load the MSOA geojson data
        map.addSource('states', {
            'type': 'geojson',
            'data': msoas,
            'generateId': true // This ensures that all features have unique IDs
        });

        var idDisplay = document.getElementById('msoaId');
        var nameDisplay = document.getElementById('msoaName');
        var clusterNumberDisplay = document.getElementById('clusterNumber');
        // var bikeUsageDisplay = document.getElementById('bikeUsage');


        // the feature-state dependent fill-opacity expression will render the hover effect
        // when a feature's hover state is set to true
        map.addLayer({
            'id': 'state-fills',
            'type': 'fill',
            'source': 'states',
            'layout': {},
            'paint': {
            'fill-color': {
              'property': 'clusterID',
              'stops': [
                [1, 'white'],
                [2, 'orange'],
                [3, 'firebrick'],
                [4, 'blue'],
                [0, 'grey']
              ]
            },
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0.5
                ]
            }
        });

       // another attempt with choropleth
        let c = new MapboxChoropleth({
            tableUrl: 'http://127.0.0.1:8887/data/test.csv',
            tableNumericField: 'cluster',
            tableIdField: 'msoa',
            geometryUrl: 'https://opendata.arcgis.com/datasets/29fdaa2efced40378ce8173b411aeb0e_2.geojson',
            geometryIdField: 'msoa11cd',
            sourceLayer: 'state-fills',
            binCount: 5,
            colorScheme: 'Spectral',
            legendElement: '#legend'
        }).addTo(map);

        map.addLayer({
            'id': 'state-borders',
            'type': 'line',
            'source': 'states',
            'layout': {},
            'paint': {
                'line-color': '#627BC1',
                'line-width': 2
            }
        });

        var msoasID = null;

        // map.on('click', 'state-fills', (e) => {

        // });

        map.on('mousemove', 'state-fills', (e) => {

        map.getCanvas().style.cursor = 'pointer';
        // Set variables equal to the current feature's magnitude, location, and time
        var idOfMsoa = e.features[0].properties.objectid;
        var nameOfMsoa = e.features[0].properties.msoa11nm;
        var ref = db.ref(e.features[0].properties.msoa11cd);

        ref.on('value', getData, errData);

        var currentObj;
        function getData(data){
          currentObj = data.val();
        }

        function errData(data){
          console.log("ERROR");
          console.log(err);
        }
        // console.log(currentObj)


        // Check whether features exist
        if (e.features.length > 0) {
            // Display the id, name and cluster in the sidebar
            idDisplay.textContent = idOfMsoa;
            nameDisplay.textContent = nameOfMsoa;
            clusterNumberDisplay.textContent = currentObj.log_zscore_kmeans_cluster;
            // bikeUsageDisplay.textContent = currentObj.bicycle_perc;
            console.log(currentObj);

            //data for the chart
            const a = currentObj.work_from_home_perc;
            const b = currentObj.on_foot_perc;
            const c = currentObj.bicycle_perc;
            const d = currentObj.car_perc;
            const e = currentObj.bus_perc;
            const f = currentObj.train_perc;
            const g = currentObj.underground_metro_perc;
            drawChart(a,b,c,d,e,f,g)


            // If quakeID for the hovered feature is not null,
            // use removeFeatureState to reset to the default behavior
            if (msoasID) {
            map.removeFeatureState({
                source: "states",
                id: msoasID
            });
            }

            msoasID = e.features[0].id;

            // When the mouse moves over the earthquakes-viz layer, update the
            // feature state for the feature under the mouse
            map.setFeatureState({
            source: 'states',
            id: msoasID,
            }, {
            hover: true
            });

            //clearing the info
            map.on("mouseleave", "state-fills", function() {
                if (msoasID) {
                  map.setFeatureState({
                    source: 'states',
                    id: msoasID
                  }, {
                    hover: false
                  });
                }

                msoasID = null;
                // Remove the information from the previously hovered feature from the sidebar
                idDisplay.textContent = '';
                nameDisplay.textContent = '';

                // Reset the cursor style
                map.getCanvas().style.cursor = '';
              });

        }

    });

    });

  });
