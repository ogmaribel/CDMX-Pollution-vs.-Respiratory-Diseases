// Create a Tile Layer


//It does not accept Nan Values


var cdmx_map = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: API_KEY,
});

var layers = {
  ACTIVE: new L.LayerGroup(),
  UNACTIVE: new L.LayerGroup(),
  INDUSTRIAL_PARK: new L.LayerGroup()
};

var map = L.map('mapa', {
    center: [19.3207671,-99.2930418],
    //center: [37.7749, -122.4194], // example for heat map
    zoom: 11,
    layers: [
      layers.ACTIVE,
      layers.UNACTIVE,
      layers.INDUSTRIAL_PARK
    ]
});

cdmx_map.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "Active Stations": layers.ACTIVE,
  "Unactive Stations": layers.UNACTIVE,
  "Industrial Parks": layers.INDUSTRIAL_PARK
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

function obtieneColor(alcaldia){ 
  //consultar en base de datos
 // d3.json("api/municipalities/").then((trace))
  alcaldia()
   
  //return '#'+Math.floor(Math.random()*16777215).toString(16);
  return 
}

var getColor = (cve_num) => {//}
//function getColor(cve_mun) {
  d3.json("/dashData", function(response) {

    //console.log(response);
    Date= response.Date;
    console.log(Date[0])
  
    Mun= response.Municipality;
    console.log(Mun[0]);
  
    CO= response.CO;
    console.log(CO[0]);
  
    N02= response.N02;
    console.log(N02[0]);
  
    PM10= response.PM10;
    console.log(PM10[0]);
  
  
  });
    

  return cve_mun === "002" ? obtieneColor("002") :
    cve_mun === "003" ? obtieneColor("002") :
    cve_mun === "004" ? obtieneColor("002") :
    cve_mun === "005" ? '#e78c4a' :
    cve_mun === "006" ? '#de425b' :
    cve_mun === "007" ? obtieneColor("007") :
    cve_mun === "008" ? '#7db168' :
    cve_mun === "009" ? '#e5d272' :
    cve_mun === "010" ? '#e78c4a' :
    cve_mun === "011" ? '#de425b' :
    cve_mun === "012" ? obtieneColor("012") :
    cve_mun === "013" ? '#fafdaa' :
    cve_mun === "014" ? '#e5d272' :
    cve_mun === "015" ? '#e78c4a' :
    cve_mun === "016" ? '#de425b' : '#488f31';
   
} // END function getColor: EDIT for change color

function style(feature) {
    return {
        fillColor: getColor(feature.properties.CVE_MUN),
        weight: 2,
        opacity: 1,
        color: 'black',
        dashArray: '3',
        fillOpacity: 0.5
    };
} // END function style (map stroke)

// Add cdmx geo json to map.
var cdmx_map = L.geoJson(cdmxjson, {style: style}).addTo(map);



// TO REVIEW: NOW JUST COMMENTS
//{
/*
function hoverFeature(h) {
  var layer = h.target;
  layer.setStyle({
    weight: 5,
    color: '#15DBCC',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  } 
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
}

var geojson;
// ... our listeners
geojson = L.geoJson(cdmxjson);

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });
}

geojson = L.geoJson(cdmxjson, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);

*/

/* POSSIBLE ICONS
"ion-android-funnel"
ion-android--home
ion-android-locate
ion-android-navigate
*/



// ICONS for Active and Unactive stations.
var icons = {
  ACTIVE: L.ExtraMarkers.icon({
    icon: "ion-android-funnel",
    iconColor: "orange",
    markerColor: "blue",
    shape: "penta"
  }),
  UNACTIVE: L.ExtraMarkers.icon({
    icon: "ion-android-funnel",
    iconColor: "white",
    markerColor: "black",
    shape: "penta"
  }),
  INDUSTRIAL_PARK: L.ExtraMarkers.icon({
    icon: "ion-android-home",
    iconColor: "white",
    markerColor: "purple",
    shape: "square"
  })
};

// READ CDMX STATIONS LOCATION
d3.csv('res/cdmx_stations.csv', function(error, stationData) {
  if (error) throw error;
  console.log(stationData);
  // test cluster
  var markers = L.markerClusterGroup();
  //console.log(stationData.length); //69

  // Create an object to keep of the number of markers in each layer
  var stationCount = {
    ACTIVE: 0,
    UNACTIVE: 0
  };

  // Initialize a stationStatusCode, which will be used as a key to access the appropriate layers, icons for the layer group.
  var stationStatusCode;
  
  for (var i = 0; i < stationData.length; i++) {
    var station = Object.assign({}, stationData[i]);
    // Get the status of the current monitoring station.
    var stationStatus = station.obs_estac;
    
    // Create a new station object with properties of both station objects    
    if(stationStatus === 'Active') {
      //console.log('OK IT IS');
      stationStatusCode = 'ACTIVE';
    } else {
      //console.log('UPS IT IS NOT');
      stationStatusCode = 'UNACTIVE';
    }

    // Update the station count002
    stationCount[stationStatusCode]++;

    // NO CLUSTERS ================================================
    // Create a new marker with the appropriate icon and coordinates
    var newMarker = L.marker([station.latitud, station.longitud], {
      icon: icons[stationStatusCode]
    });  // OK
    // Add the new marker to the appropriate layer
    newMarker.addTo(layers[stationStatusCode]).bindPopup(station.nom_estac);  // maybe here .bindPopup(station.nom_estac)
    // END: NO CLUSTERS ================================================ SEE WHERE .bindPopup(station.nom_estac)

    /*
    // With CLUSTERS ================================================
    markers.addLayer(L.marker([station.latitud, station.longitud], {
      icon: icons[stationStatusCode]
    })).bindPopup(station.nom_estac);
    map.addLayer(markers);
    // END CLUSTERS ================================================
    */
    

  } // END for statios: active/unactive  
}); // END read_csv STATIONS


// READ INDUSTRIAL PARKS LOCATIONS AND ADD LAYER TO MAP.
d3.csv('res/industrial_parks.csv', function(error, parkData) {
  if (error) throw error;
  console.log(parkData);  

  for (var i = 0; i < parkData.length; i++) {
    var park = Object.assign({}, parkData[i]);
    // Get the current park name.
    var park_name = park.nom_parque;

    // Create a new marker with the appropriate icon and coordinates
    var newMarker = L.marker([park.latitud, park.longitud], {
      icon: icons['INDUSTRIAL_PARK']
    });  

     // Add the new marker to the appropriate layer
     newMarker.addTo(layers['INDUSTRIAL_PARK'])
              .bindPopup(park_name);
  } // END FOR Industrial parkData
}); // END read_csv INDUSTRIAL PARKS




// Create the HEAT LAYER, inside the data reading ============ REVIEW =============================================
//var url = "https://data.sfgov.org/resource/cuks-n6tp.json?$limit=10000";
/*
d3.json(url, function(response) {
  var heatArray = [];

  for (var i = 0; i < response.length; i++) {
    var location = response[i].location;

    if (location) {
      heatArray.push([location.coordinates[1], location.coordinates[0]]);
    }
  }

  var heat = L.heatLayer(heatArray, {
    radius: 20,
    blur: 35
  }).addTo(map);

});
*/
// Create the HEAT LAYER, inside the data reading ==========================================================