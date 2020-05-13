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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Read in MSOA data and check that it worked
const msoas = "http://127.0.0.1:8887/data/msoas.geojson"
console.log(msoas);

// When map loads...
map.on('load', function() {

    // Load the MSOA geojson data
    map.addSource('states', {
        'type': 'geojson',
        'data': msoas,
        'generateId': true
    });
  
    // Add MSOA polygons
    map.addLayer({
        'id': 'state-fills',
        'type': 'fill',
        'source': 'states',
        'layout': {
          // Make layer visible by default
          'visibility': 'visible'},
        'paint': {
          // Cluster numbers are 0-4 - 0 is cluster 1, 1 is cluster 2, etc.
          'fill-color': 
          ['match',
          ['get', 'log_zscore_kmeans_cluster'],
          0,'#ffa372',
          /* other */ 'rgba(27,38,44, 0.0)'],           
          'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              1,
              0.7
          ]
        }
    });

    map.addLayer({
      'id': 'cluster2',
      'type': 'fill',
      'source': 'states',
      'layout': {            
        'visibility': 'visible'},
      'paint': {
        'fill-color': 
        ['match',
        ['get', 'log_zscore_kmeans_cluster'],
        1,'#ed6663',
        /* other */ 'rgba(27,38,44, 0.0)'],  
        'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.7
        ]
      }
    });
  
    map.addLayer({
      'id': 'cluster3',
      'type': 'fill',
      'source': 'states',
      'layout': {            
        'visibility': 'visible'},
      'paint': {
        'fill-color': 
        ['match',
        ['get', 'log_zscore_kmeans_cluster'],
        2,'#37a583',
        /* other */ 'rgba(27,38,44, 0.0)'],  
        'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.7
        ]
      }
    });

    map.addLayer({
      'id': 'cluster4',
      'type': 'fill',
      'source': 'states',
      'layout': {            
        'visibility': 'visible'},
      'paint': {
        'fill-color': 
        ['match',
        ['get', 'log_zscore_kmeans_cluster'],
        3,'#186da0',
        // 4,'#fff059',
        /* other */ 'rgba(27,38,44, 0.0)'],  
        'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.7
        ]
      }
    });

    map.addLayer({
      'id': 'cluster5',
      'type': 'fill',
      'source': 'states',
      'layout': {            
        'visibility': 'visible'},
      'paint': {
        'fill-color': 
        ['match',
        ['get', 'log_zscore_kmeans_cluster'],
        4,'#fff059',
        /* other */ 'rgba(27,38,44, 0.0)'],  
        'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.7
        ]
      }
    });

    // Get HTML elements that will change when an MSOA is clicked on
    var idDisplay = document.getElementById('msoaId');
    var nameDisplay = document.getElementById('msoaName');
    var clusterNumberDisplay = document.getElementById('clusterNumber');

    // Store which MSOA is being hovered over or clicked on 
    var msoaID = null;
    var msoaIDClick = null;

    ///////////////////////////////////////////////////////////////////////////

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
                console.log("Storing selected MSOA ID...");
              }

              // Store msoa11cd of currently selected MSOA
              msoaIDClick = e1.features[0].properties.msoa11cd;

              // When a new MSOA is clicked on, turn off flows switchs and reset flow layers
              document.getElementById("switch").checked = false;
              turnOffFlows();

              // Set variables equal to the current, clicked feature's info
              // var idOfMsoa = e1.features[0].properties.objectid;
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
              // idDisplay.textContent = idOfMsoa;
              nameDisplay.textContent = nameOfMsoa;
              clusterNumberDisplay.textContent = currentObj.log_zscore_kmeans_cluster;

              // Get data and draw chart
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

    // If cluster switch is toggled on
    function getClustersColoured(){
      // cluster 1
      $('#myonoffswitchCluster1').click(function(){
        if($(this).is(':checked')){
          map.setLayoutProperty('state-fills', 'visibility', 'visible');
        }
        else{
          map.setLayoutProperty('state-fills', 'visibility', 'none');
        }
      })
      // cluster 2 
      $('#myonoffswitchCluster2').click(function(){
        if($(this).is(':checked')){
          map.setLayoutProperty('cluster2', 'visibility', 'visible');
        }
        else{
          map.setLayoutProperty('cluster2', 'visibility', 'none');
        }
      })
      // cluster 3 
      $('#myonoffswitchCluster3').click(function(){
        if($(this).is(':checked')){
          map.setLayoutProperty('cluster3', 'visibility', 'visible');
        }
        else{
          map.setLayoutProperty('cluster3', 'visibility', 'none');
        }
      })
      // cluster 4 
      $('#myonoffswitchCluster4').click(function(){
        if($(this).is(':checked')){
          map.setLayoutProperty('cluster4', 'visibility', 'visible');
        }
        else{
          map.setLayoutProperty('cluster4', 'visibility', 'none');
        }
      })
      // cluster 5 
      $('#myonoffswitchCluster5').click(function(){
        if($(this).is(':checked')){
          map.setLayoutProperty('cluster5', 'visibility', 'visible');
        }
        else{
          map.setLayoutProperty('cluster5', 'visibility', 'none');
        }
      })
    }    

    getClustersColoured();

  ///////////////////////////////////////////////////////////////////////////

    // If flows switch is toggled on...
    $('#switch').click(function(){
        if($(this).is(':checked')){

            // If the user tries to turn on flows without choosing an MSOA...
            if (msoaIDClick == null) {
              alert("Please click on an MSOA.");
              document.getElementById("switch").checked = false;
            }

            console.log('Flows switch has been checked...');
            console.log('Getting flows for: ' + msoaIDClick);

            // Set API URL for ORIGIN flows
            var url = "http://dev.spatialdatacapture.org:8717/data/originflows/" + msoaIDClick + "/";

            //////////////////////////////////////////////////////////////////////

            // Get the origin flows data 
            $.getJSON ( url , function( data ) {

              // Check that call is working
              console.log("Retrieving data...");

              // Store data for flow features 
              var features = [];

              $.each ( data, function( k, v ) {

                // Get starting location 
                var orig_lon = v["Orig_Lon"];
                var orig_lat = v["Orig_Lat"];
                var orig = [orig_lon, orig_lat];

                // Get destination location
                var dest_lon = v["Dest_Lon"];
                var dest_lat = v["Dest_Lat"];
                var dest = [dest_lon, dest_lat];

                // Get breakdown of modes for this origin and destination combination
                var mode_list =  ['from_home', 'underground_metro_lightrail_tram', 'Train', 'Taxi', 'motorcycle', 'Bicycle', 'walk', 'other'];
                var color_list = ['#696969', '#fff059', '#186da0', '#ffa372', '#714b7f', '#37a583', '#ed6663', '#fff3e0'];
      
                for (var i = 0; i < mode_list.length; i++) {
                  // Collect data for this mode
                  var newData = {
                    'type': 'Feature',
                    'id': v["orig_name"], 
                    'properties': {
                      'type': mode_list[i],
                      'color': color_list[i],
                      'volume': v[mode_list[i]],
                      'weight': v[mode_list[i]]
                    },
                    'geometry': {
                      'type':'LineString',
                      'coordinates': [orig, dest]
                    }
                  }; // end of newData

                  // Push new data to array and check on progress
                  features.push(newData);
                  console.log(features.length, features[0].id);

                }; //end of mode_list
              }); // end of for each

              // Build geoJSON
              var dataArray = {
                'type': 'FeatureCollection',
                'features': features,
              };

              // Check that everything loaded
              console.log('Data has been loaded:');
              console.log(dataArray);

              map.addSource('flowLines', {
                'type': 'geojson',
                'data': dataArray,
              });

              // Add MSOA outlines
              map.addLayer({
                'id': 'state-borders',
                'type': 'line',
                'source': 'states',
                'layout': {},
                'paint': {
                    'line-color': '#141d21',
                    'line-width': 1
                }
              });

              map.addLayer({
                'id': 'flowLines',
                'type': 'line',
                'source': 'flowLines',
                'layout': {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                'paint': {
                  'line-color': ['get', 'color'],
                  'line-width': ['get', 'weight']
                }
              });

            }); // end of getJSON

              // DECK.GL ATTEMPS 

              // Create new map 
              // const flowMap = new mapboxgl.Map({
              //     container: 'map_container',
              //     style: 'mapbox://styles/cheyne-campbell/ck966jun93urx1iqlhlheiknl',
              //     center: dataArray[0].orig,
              //     zoom: 12,
              //     pitch: 60
              // });

              // flowMap.on('style.load', () => {
              //     const flowArcs = new MapboxLayer({
              //       id: 'flowArcs',
              //       type: ArcLayer,
              //       data: dataArray,
              //       getSourcePosition: d => d.orig,
              //       getTargetPosition: d => d.dest,
              //       //getSourceColor: d => [64, 255, 0],
              //       //getTargetColor: d => [0, 128, 200]
              //     });

              //     // //Add the deck.gl arc layer to the map 
              //     flowMap.addLayer(flowArcs);

              // });

        //////////////////////////////////////////////////////////////////////

        } else {
            console.log('Our checkbox is not checked!');
            turnOffFlows();
        }

    }); // end of flows switch

    //////////////////////////////////////////////////////////////////////

    // Remove layers that are added when the flows switch is turned on
    function turnOffFlows() {

      var flowSource = map.getSource('flowLines');
      var flowLayer = map.getLayer('flowLines');
      var borderLayer = map.getLayer('state-borders');

      if ( typeof flowSource !== 'undefined') {
        map.removeSource('flowLines');
      }
      if ( typeof flowLayer !== 'undefined') {
        map.removeLayer('flowLines');
      }
      if ( typeof borderLayer !== 'undefined') {
        map.removeLayer('state-borders');
      }

    }

}); // end of on load


