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
  apiKey: 'AIzaSyBB8J3_bgG7AYKrmYthHqzD3gAHNUk925A',
  authDomain: 'spidercartographers.firebaseapp.com',
  databaseURL: 'https://spidercartographers.firebaseio.com',
  projectId: 'spidercartographers',
  storageBucket: 'spidercartographers.appspot.com',
  messagingSenderId: '1018443119846',
  appId: '1:1018443119846:web:2edfb7354e138727694f27',
  measurementId: 'G-RQHR5T16XR'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.database();

// Read in MSOA data and check that it worked
const msoas = 'assets/data/msoas.geojson'
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
    var nameDisplay = document.getElementById('msoaName');
    var clusterNumberDisplay = document.getElementById('clusterNumber');

    // Store cluster names as list
    var clusterNames = ['Soley car dependant', 'Lack of accessibility across all transport modes',
                        'High public transport and good accessibility', 'Car reliant but high public transport',
                        'Good train accessibility but car dependant'];

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
                console.log('Storing selected MSOA ID...');
              }

              // Store msoa11cd of currently selected MSOA
              msoaIDClick = e1.features[0].properties.msoa11cd;

              // When a new MSOA is clicked on, turn off flows switchs and reset flow layers
              document.getElementById('myonoffswitchFlows').checked = false;
              turnOffFlows();

              // Set variables equal to the current, clicked feature's info
              // var idOfMsoa = e1.features[0].properties.objectid;
              var nameOfMsoa = e1.features[0].properties.msoa11nm;
              var ref = db.ref(e1.features[0].properties.msoa11cd);

              // Get data from firebase and display in sidebar
              ref.on('value', function(snapshot) {
                var currentObj = snapshot.val();

                // Display the id, name and cluster in the sidebar
                nameDisplay.textContent = nameOfMsoa;
                clusterNumberDisplay.textContent = clusterNames[currentObj.log_zscore_kmeans_cluster - 1];

                // Get data and draw chart
                const a = currentObj.work_from_home_perc;
                const b = currentObj.on_foot_perc;
                const c = currentObj.bicycle_perc;
                const d = currentObj.car_perc;
                const e = currentObj.bus_perc;
                const f = currentObj.train_perc;
                const g = currentObj.underground_metro_perc;
                drawChart(a,b,c,d,e,f,g)
              }); // end of ref.on

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

    // If cluster's switch is toggled on...
    function getClustersColoured(){

      // High public transport and good accessibility
      $('#myonoffswitchCluster3').click(function(){
        if($(this).is(':checked')){
          map.setLayoutProperty('state-fills', 'visibility', 'visible');
        }
        else{
          map.setLayoutProperty('state-fills', 'visibility', 'none');
        }
      })

      // Car reliant but high public transport
      $('#myonoffswitchCluster4').click(function(){
        if($(this).is(':checked')){
          map.setLayoutProperty('cluster2', 'visibility', 'visible');
        }
        else{
          map.setLayoutProperty('cluster2', 'visibility', 'none');
        }
      })

      // Good train accessibility but car dependant
      $('#myonoffswitchCluster5').click(function(){
        if($(this).is(':checked')){
          map.setLayoutProperty('cluster3', 'visibility', 'visible');
        }
        else{
          map.setLayoutProperty('cluster3', 'visibility', 'none');
        }
      })

      // Soley car dependant
      $('#myonoffswitchCluster1').click(function(){
        if($(this).is(':checked')){
          map.setLayoutProperty('cluster4', 'visibility', 'visible');
        }
        else{
          map.setLayoutProperty('cluster4', 'visibility', 'none');
        }
      })

      // Lack of accessibility across all transport modes
      $('#myonoffswitchCluster2').click(function(){
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
    $('#myonoffswitchFlows').click(function(){
        if($(this).is(':checked')){

            // If the user tries to turn on flows without choosing an MSOA...
            if (msoaIDClick != null) {

              document.getElementById('flowsLegend').style.display = 'block';

              console.log('Flows switch has been checked...');
              console.log('Getting flows for: ' + msoaIDClick);

              // Set API URL for ORIGIN flows
              var url = 'http://dev.spatialdatacapture.org:8717/data/originflows/' + msoaIDClick + '/';

              // Get the origin flows data
              $.getJSON ( url , function( data ) {

                // Check that call is working
                console.log('Retrieving data...');

                // Store data for flow features
                var features = [];

                $.each ( data, function( k, v ) {

                  // Get starting location
                  var orig_lon = v['Orig_Lon'];
                  var orig_lat = v['Orig_Lat'];
                  var orig = [orig_lon, orig_lat];

                  // Get destination location
                  var dest_lon = v['Dest_Lon'];
                  var dest_lat = v['Dest_Lat'];
                  var dest = [dest_lon, dest_lat];

                  // Get breakdown of modes for this origin and destination combination
                  var mode_list =    ['from_home', 'underground_metro_lightrail_tram',       'Train',   'Taxi',    'motorcycle', 'Bicycle', 'walk',    'other',   'car'];
                  var mode_display = ['From home', 'Underground, metro, lightrail, or tram', 'Train',   'Taxi',    'Motorcycle', 'Bicycle', 'Walk',    'Other',   'Car'];
                  var color_list =   ['#ff1c24',   '#ffff059',                               '#35ccef', '#fea472', '#a56ab7',    '#c2ef51', '#ed6663', '#b3b3b3', '#ffffff'];

                  for (var i = 0; i < mode_list.length; i++) {

                    // if the volume is less than 5 don't include in visualization
                    if ((v[mode_list[i]] > 4) == false) {
                      console.log('it is a no flow');
                      continue;
                    }

                    // Collect data for this mode
                    var newData = {
                      'type': 'Feature',
                      'origname': v['orig_name'],
                      'destname': v['dest_name'],
                      'properties': {
                        'origname_prop': v['orig_name'],
                        'destname_prop': v['dest_name'],
                        'mode': mode_display[i],
                        'color': color_list[i],
                        'volume': v[mode_list[i]],
                        'weight': v[mode_list[i]] / 2
                      },
                      'geometry': {
                        'type':'LineString',
                        'coordinates': [orig, dest]
                      }
                    }; // end of newData

                    // Push new data to array and check on progress
                    features.push(newData);
                    console.log(features.length, features[0].origname);

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

                // Center map on selected MSOA
                if (dataArray.features.length > 0) {
                  map.flyTo({ 
                    center: dataArray.features[0].geometry.coordinates[0],
                    zoom: 10
                  });
                } 

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
                    'line-opacity': 0.75,
                    'line-color': ['get', 'color'],
                    'line-width': ['get', 'weight']
                  }
                });

                // If there are no flows with 5 or more people, alert user and turn off flows switch
                if (dataArray.features.length <= 0) {
                  alert('Uh oh! Not enough people commute from this MSOA to display the data. Try choosing another.');
                  document.getElementById('myonoffswitchFlows').checked = false;
                  turnOffFlows();
                }

                // Add hover pop up box for each flow line
                map.on('mouseenter', 'flowLines', function(e) {

                  map.getCanvas().style.cursor = 'pointer';

                  console.log(e);
                  
                  // Store information about the flow line
                  var residence = e.features[0].properties.origname_prop;
                  var workplace = e.features[0].properties.destname_prop;
                  var mode = e.features[0].properties.mode;
                  var volume = e.features[0].properties.volume;
                  
                  // Make pop up visible
                  document.getElementById('flowsPopup').style.visibility = 'visible';

                  // Find elements where the data will be displayed
                  var flowOrigin = document.getElementById('flowOrigin');
                  var flowDest = document.getElementById('flowDest');
                  var flowMode = document.getElementById('flowMode');
                  var flowVolume = document.getElementById('flowVolume');

                  // Populate the pop up
                  flowOrigin.textContent = residence;
                  flowDest.textContent = workplace;
                  flowMode.textContent = mode;
                  flowVolume.textContent = volume;
                  
                  // When no flow is hovered on, remove pop up box
                  map.on('mouseleave', 'flowLines', function() {
                    map.getCanvas().style.cursor = '';
                    document.getElementById('flowsPopup').style.visibility = 'hidden';
                  }); // end of mouseleave for flowLines

                });// end of mouseenter for flowLines
              }); // end of getJSON
            } else {
              alert('Please click on an MSOA.');
              document.getElementById('myonoffswitchFlows').checked = false;
              turnOffFlows();
            }

        //////////////////////////////////////////////////////////////////////

        } else {
            console.log('Our checkbox is not checked!');
            turnOffFlows();
        }
    }); // end of flows switch

    //////////////////////////////////////////////////////////////////////

    // Remove layers that are added when the flows switch is turned on
    function turnOffFlows() {

      document.getElementById('flowsLegend').style.display = 'none';

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

    } // end of turnOffFlows function

}); // end of on load
