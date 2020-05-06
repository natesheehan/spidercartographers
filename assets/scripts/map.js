import { drawChart } from './mapBoxChart.js';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hleW5lLWNhbXBiZWxsIiwiYSI6ImNrOHMxYW9wYTA0OWkzZXBhenJyemFsbnIifQ.cXgp6qu6dAmDTAh-ID2M3g';

var map = new mapboxgl.Map({
    container: 'map_container',
    style: 'mapbox://styles/cheyne-campbell/ck966jun93urx1iqlhlheiknl',
    center: [-4.0, 55],
    zoom: 5.5
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
var msoaData = $.ajax({
  url: "https://opendata.arcgis.com/datasets/29fdaa2efced40378ce8173b411aeb0e_2.geojson"
  }).done(function(msoas){

    // Check that data was read in correctly 
    console.log(msoas);

    // attempt to split data into two parts and load them seperately 

    // const msoasPart1 = {
    //   "type": "FeatureCollection",
    //   "name": "d443bed3-24e4-4541-a1d7-0657a0dfa8492020329-1-16kypme.674w",
    //   "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    //   "features": []};

    // const msoasPart2 ={
    //   "type": "FeatureCollection",
    //   "name": "d443bed3-24e4-4541-a1d7-0657a0dfa8492020329-1-16kypme.674w",
    //   "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    //   "features": []};

    async function findClusters() {

      // Create array for looking up clusters
      // var clusterLookUp = {}; 
      
      msoas.features.forEach(entry => {
          
          // Get MSOA ID of feature
          var msoaID = entry.properties.msoa11cd;

          // Reference Firebase data 
          var msoaRef = db.ref(msoaID);

          msoaRef.once('value', function(data) {
              var clusterID = data.val().log_zscore_kmeans_cluster; 
              // clusterLookUp[msoaID] = clusterID;
              entry.properties = {...entry.properties, clusterID: clusterID} //that adds another property of clusterID to msoas

          }); 
      })

      // attempt to split data into two parts and load them seperately

      // for (var i=0; i<msoas.features.length; i++){
      //   if (i<4000){
      //     msoasPart1.features.push(msoas.features[i]);
      //   }
      //   else{
      //     msoasPart2.features.push(msoas.features[i]);
      //   }
      // }

    }
   
    /////////////////////////////////// ^ CLUSTER LOOK UP ARRAY ^ //////////////////////////////
  
    findClusters();
    // console.log(msoas);

    map.on('load', function() {

        // Load the MSOA geojson data
        map.addSource('states', {
            'type': 'geojson',
            'data': msoas,
            'buffer': 1,
            'generateId': true // This ensures that all features have unique IDs
        });

        // Add centroids 
        map.addSource('centroids', {
          'type': 'geojson',
          'data': 'http://127.0.0.1:8887/MSOA_Centroids.geojson'
        });

        // Add MSOA polygons - opacity changes upon hover 
        map.addLayer({
            'id': 'state-fills',
            'type': 'fill',
            'source': 'states',
            'layout': {},
            'paint': {
            'fill-color': {
              property: 'clusterID',
              stops: [
                  [1, 'white'],
                  [2, 'red'],
                  [3, 'blue'],
                  [4, 'green'],
                  [5, 'yellow']                  
              ]
          },
        //     // ['match',
        //     //   ['get', 'clusterID'],
        //     //   1,'blue',
        //     //   2,'red',
        //     //   3,'green',
        //     //   4,'yellow',
        //     //   5,'pink',
        //     //   /* other */ 'black'],
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0.5
                ]
            }
        }); 

          //another attempt with choropleth
          // let c = new MapboxChoropleth({
          //     tableUrl: 'http://127.0.0.1:8887/data/clusters.csv', // Firebase table
          //     tableNumericField: 'Clusters',
          //     tableIdField: 'ID',
          //     geometryUrl: 'https://opendata.arcgis.com/datasets/29fdaa2efced40378ce8173b411aeb0e_2.geojson',
          //     geometryIdField: 'msoacd11', // MSOA geojson
          //     sourceLayer: 'states',
          //     binCount: 5,
          //     colorScheme: 'Spectral',
          //     legendElement: '#legend'
          // }).addTo(map);

          // Add MSOA outlines         
          map.addLayer({
            'id': 'state-borders',
            'type': 'line',
            'source': 'states',
            'layout': {},
            'paint': {
                'line-color': '#627BC1',
                'line-width': 0.5
            }
        });

        // Get HTML elements that will change when an MSOA is clicked on 
        var idDisplay = document.getElementById('msoaId');
        var nameDisplay = document.getElementById('msoaName');
        var clusterNumberDisplay = document.getElementById('clusterNumber');
        var msoasID = null;

        // map.on('click', 'state-fills', (e) => {

        // });

        map.on('mousemove', 'state-fills', (e) => {

        map.getCanvas().style.cursor = 'pointer';
        // Set variables equal to the current feature's id and name
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

                  if (msoaIDClick) {
                    console.log("doing the thing");
                  }

                  msoaIDClick = e1.features[0].geometry.coordinates;
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
                var polygon = msoaIDClick;

                // Get MSOA centroid      
                var marker = new mapboxgl.Marker(polygon.getBounds().getCenter()).addTo(map);


            } else {
                console.log('Our checkbox is not checked!');
            }
        }); // end of flows switch

    }}) // end of on load 
  })// end of ajax
  });