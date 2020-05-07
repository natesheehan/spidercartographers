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
// var msoaData = $.ajax({
//   url: "https://opendata.arcgis.com/datasets/29fdaa2efced40378ce8173b411aeb0e_2.geojson"
//   }).done(function(msoas){

    // Check that data was read in correctly 
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

                  if (msoaIDClick) {
                    console.log("doing the thing");
                  }

                  msoaIDClick = e1.features[0].properties.msoa11cd;
                  ///msoaID = e1.features[0].id;

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

                // Note that switch has been turned on 
                console.log('Flows switch has been turned on!');
                
                // Check the ID of the currently selected MSOA
                console.log(msoaIDClick);

                //////////////////////////////////////////////////////////////////////
                function getData() {
                  console.log("GET DATA BEGUN");

                  // Set API URL for origin flows
                  var url = "http://dev.spatialdatacapture.org:8717/data/originflows/" + msoaIDClick + "/";
                  
                  // Store data here
                  var dataArray = [];

                  // Flag when dataArray has been populated 
                  var flag = false;

                  // Get the origin flows data 
                  $.getJSON ( url , function( data ) {

                    // Check that call is working
                    console.log("working?");
                    flag = true;

                    $.each ( data, function(k, v) {
    
                      // Starting location - should be the same for all 
                      var orig_lon = v["Orig_Lon"];
                      var orig_lat = v["Orig_Lat"];
                      var orig = [orig_lon, orig_lat];

                      // Destination location
                      var dest_lon = v["Dest_Lon"];
                      var dest_lat = v["Dest_Lat"];
                      var dest = [dest_lon, dest_lat];

                      // Collect data 
                      var newData = {
                        "origID":                           v["orig_name"],
                        "orig":                             orig, 
                        "dest":                             dest, 
                        "from_home":                        v["from_home"], 
                        "underground_metro_lightrail_tram": v["underground_metro_lightrail_tram"], 
                        "train":                            v["Train"], 
                        "taxi":                             v["Taxi"],
                        "motorcycle":                       v["Motorcycle"], 
                        "bicycle":                          v["Bicycle"],
                        "walk":                             v["walk"],
                        "other":                            v["other"]
                      };

                      // Push new data to array and check on progress
                      dataArray.push(newData);
                      console.log(dataArray.length, dataArray[0].origID);
                  
                    }); // end of for each
                  }); // end of getJSON
                } 



                //////////////////////////////////////////////////////////////////////
                function mapFlows() {
                  var data = getData();
                  console.log("MAKE FLOW MAP BEGUN");
                  console.log("Data passed: " + data);

                  const flowMap = new mapboxgl.Map({
                      container: "map_container",
                      style: "mapbox://styles/mapbox/light-v9",
                      center: [data[0].Orig_Lon, data[0].Orig_Lon],
                      zoom: 12,
                      pitch: 60
                  });

              
                  flowMap.on("load", () => {
                      // Get data for the arc map from SFMTA origin/destination routes
                      fetch(url)
                          .then((response) => response.json())
                          .then((responseJSON) => {console.log(responseJSON);})
                          //.then(function(responseJSON) //{
                              // const flowArcs = new MapboxLayer({
                              //     id: 'flowArcs',
                              //     type: ArcLayer,
                              //     data: responseJSON,
                              //     getSourcePosition: d => [d.Orig_Lon, d.Orig_Lat],
                              //     getTargetPosition: d => [d.Dest_Lon, d.DestLat],
                              //     //getSourceColor: d => [64, 255, 0],
                              //     //getTargetColor: d => [0, 128, 200]
                              // });
                        
                              // //Add the deck.gl arc layer to the map 
                              // flowMap.addLayer(flowArcs, 'waterway-label');
                          //});
                  });
                } 

                mapFlows();
    

 


                // Check on completed data array 
                // console.log(dataArray);

              



                // create new deck.gl layer 
                // var deckgl = new deck.DeckGL({
                  
                //   container: 'map_container',
                //   mapboxApiAccessToken: mapboxgl.accessToken,
                
                //   initialViewState: {
                //     longitude: orig_lon,
                //     latitude: orig_lat,
                //     zoom: 6,
                //     bearing: 0,
                //     pitch: 30,
                //   },
                //   controller: true,
                
                //   layers: [
                //   //   new deck.GeoJsonLayer({
                //   //     id: 'flowBase',
                //   //     data: msoas,
                //   //     filled: true,
                //   //     pointRadiusMinPixels: 2,
                //   //     pointRadiusScale: 2000,
                //   //     getRadius: f => (11 - f.properties.scalerank),
                //   //     getFillColor: f => f.properties.log_zscore_kmeans_cluster,
                //   //     pickable: true,
                //   //     autoHighlight: true,
                //   //     onClick: info => info.object
                //   //   }),
                //     new deck.ArcLayer({
                //       id: 'flowArcs',
                //       data: dataArray,
                //       dataTransform: d => d.features,
                //       getSourcePosition: d => d.orig, 
                //       getTargetPosition: d => d.dest,
                //       // getSourceColor: [0, 128, 200],
                //       // getTargetColor: [200, 0, 80],
                //       // getWidth: data[0].val
                //     })
                //   ]
                // }); // end of new deck.gl layer

                // map.addLayer(deckgl);

            } else {
                console.log('Our checkbox is not checked!');
            }
        }); // end of flows switch
    }); // end of on load 
<<<<<<< HEAD
  }); // end of ajax



=======
  // }); // end of ajax
>>>>>>> f6bd2c20e1e8d272ebb61efbf059763435243c76
