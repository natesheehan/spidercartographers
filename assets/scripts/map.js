mapboxgl.accessToken = 'pk.eyJ1IjoiY2hleW5lLWNhbXBiZWxsIiwiYSI6ImNrOHMxYW9wYTA0OWkzZXBhenJyemFsbnIifQ.cXgp6qu6dAmDTAh-ID2M3g';

var map = new mapboxgl.Map({
    container: 'map_container',
    style: 'mapbox://styles/cheyne-campbell/ck966jun93urx1iqlhlheiknl',
    center: [-4.0, 55],
    zoom: 5.5
});


// variable to store MSOA geojson
var msoas;

// fetch the geojson data directly - may not work on some browsers but that is a problem for another day
fetch('https://opendata.arcgis.com/datasets/29fdaa2efced40378ce8173b411aeb0e_2.geojson')
  .then(response => response.json())
  .then(data => msoas = data)
  // can remove console.log step - used for checking what's going on
  .then(() => console.log(msoas))


var hoveredStateId = null;
 
map.on('load', function() {
    // load the MSOA geojson data
    map.addSource('states', {
        'type': 'geojson',
        'data': msoas,
        'generateId': true // This ensures that all features have unique IDs
    });

    var idDisplay = document.getElementById('msoaId');
    var nameDisplay = document.getElementById('msoaName');
    
    
    // the feature-state dependent fill-opacity expression will render the hover effect
    // when a feature's hover state is set to true
    map.addLayer({
        'id': 'state-fills',
        'type': 'fill',
        'source': 'states',
        'layout': {},
        'paint': {
        'fill-color': '#627BC1',
        'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.5
            ]
        }
    });

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

    map.on('mousemove', 'state-fills', (e) => {

    map.getCanvas().style.cursor = 'pointer';
    // Set variables equal to the current feature's magnitude, location, and time
    var idOfMsoa = e.features[0].properties.objectid;
    var nameOfMsoa = e.features[0].properties.msoa11nm;
    

    // Check whether features exist
    if (e.features.length > 0) {
        // Display the magnitude, location, and time in the sidebar
        idDisplay.textContent = idOfMsoa;
        nameDisplay.textContent = nameOfMsoa;
        

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