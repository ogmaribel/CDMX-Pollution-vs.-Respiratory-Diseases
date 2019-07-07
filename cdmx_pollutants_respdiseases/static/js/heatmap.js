// ----------------------------------------------------
// | Code for double animated heat maps:              |
// | Contaminant and Respiratory emergencies heatmaps |
// | Daily through 2016                               |
// ----------------------------------------------------

// Initialize heat layers
let contaminantHeatLayer = undefined;
let emergenciesHeatLayer = undefined;

// Create an array with formatted 2016 date strings
function appendLeadingZeroes(n) {
    if (n <= 9) {
        return "0" + n;
    }
    return n
}
var months = ['January', 'February', 'March', 'April', 'June', 'July', 'August', 'September', 'November', 'December']
var daysOfYear = []
var daysOfYearNoCero = []
var daysPretty = []
for (var d = new Date(2016, 0, 1); d <= new Date(2016, 11, 31); d.setDate(d.getDate() + 1)) {
    var dateString = appendLeadingZeroes(d.getDate()) + "/" + appendLeadingZeroes(d.getMonth() + 1) + "/" + d.getFullYear()
    var dateStringNoCero = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
    var currentMonth = d.getMonth()
    var datePretty = months[currentMonth] + " " + d.getDate() + ", " + d.getFullYear();
    daysOfYear.push(dateString);
    daysOfYearNoCero.push(dateStringNoCero)
    daysPretty.push(datePretty)
}

// ----------------------------------------------------
// | Contaminant and Emergencies Heatmaps Base Layers |
// ----------------------------------------------------

// Contaminant base map
var contaminantMap = new L.Map('contaminantMap', {
    center: new L.LatLng(19.3259512,-99.1402701),
    zoom: 11,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    zoomControl: false
});
var baseLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
}).addTo(contaminantMap);
L.geoJson(cdmxjson, {fillOpacity:0, color:'#8A8A8A'}).addTo(contaminantMap);

// Emergencies base map
var emergenciesMap = new L.Map('emergenciesMap', {
    center: new L.LatLng(19.3259512,-99.1402701),
    zoom: 11,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    zoomControl: false
});
var baseLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
}).addTo(emergenciesMap);
L.geoJson(cdmxjson, {fillOpacity:0, color:'#8A8A8A'}).addTo(emergenciesMap);


// Create initial map with O3 levels on 01/01/2016
var init = () => {
    getData("O3", '01/01/2016');
}

// ------------------------------
// | Update Heatlayer functions |
// ------------------------------

// -------------------------
// | Contaminant Heatlayer |
// -------------------------
const createContaminantLayer = async (selectedContaminant, selectedDate) => {
    const url = `/contaminants/?q={"id_parameter":"${selectedContaminant}","date":"${selectedDate}"}`;
    d3.json(url, function (contaminants) {
        console.log(`down ${selectedDate}`);
        console.log(`down ${selectedContaminant}`);
        var graphContaminant = contaminants.data;
        var contaminantHeatArray = [];
        for (let j = 0; j < graphContaminant.length; j++) {
            var value = graphContaminant[j].value;
            if (value) {
                contaminantHeatArray.push([graphContaminant[j].latitud, graphContaminant[j].longitud, graphContaminant[j].value]);
            }
        }
        if (contaminantHeatLayer !== undefined) {
            contaminantMap.removeLayer(contaminantHeatLayer);
        }
        contaminantHeatLayer = L.heatLayer(contaminantHeatArray, {
            radius: 50,
            blur: 45,
            opacity: 0.5
        }).addTo(contaminantMap);
    });
}

// -------------------------
// | Emergencies Heatlayer |
// -------------------------
const createEmergenciesLayer = async (selectedDate) => {
    const url = `/emergencies/?q={"date":"${selectedDate}"}`;
    d3.json(url, function (emergencies) {
        console.log(`down ${selectedDate}`);

        var graphEmergencies = emergencies.data;
        var emergenciesHeatArray = [];
        for (let j = 0; j < graphEmergencies.length; j++) {
            var value = graphEmergencies[j].count;
            if (value) {
                emergenciesHeatArray.push([graphEmergencies[j].latitud, graphEmergencies[j].longitud, graphEmergencies[j].count]);
            }
        }
        if (emergenciesHeatLayer !== undefined) {
            emergenciesMap.removeLayer(emergenciesHeatLayer);
        }
        emergenciesHeatLayer = L.heatLayer(emergenciesHeatArray, {
            radius: 50,
            blur: 45,
            opacity: 0.5
        }).addTo(emergenciesMap);
    });
}


// -------------------------------------
// | Animation of heatmaps on each day |
// -------------------------------------
var arrays = [];
var animatedLoop = () => {
    for (let i = 0; i < daysOfYear.length; i++) {
        arrays.push(setTimeout(function () {
            var date = daysOfYear[i];
            var dateNoCero = daysOfYearNoCero[i]
            d3.select('#date-counter').html(`<h5>${daysPretty[i]}</h5>`);
            var contaminantSelected = d3.select("#selContaminant").property("value");
            createContaminantLayer(contaminantSelected, date);
            createEmergenciesLayer(dateNoCero);
            console.log(i);
        }, 300 * i));
        (d.getMonth() + 1)

    }

}

// Contaminant selection before animation starts
function getData(selCont) {
    var contName = ''
    if (selCont === 'O3') {contName = 'Ozone (O<sub>3</sub>)'}
    else if (selCont === 'PM10') {contName = 'Particulate Matter (PM<sub>10</sub>)'}
    else if (selCont === 'PM10') {contName = 'Particulate Matter (PM<sub>10</sub>)'}
    else if (selCont === 'PM2.5') {contName = 'Particulate Matter (PM<sub>2.5</sub>)'}
    else if (selCont === 'CO') {contName = 'Carbon Monoxide (CO)'}
    else if (selCont === 'NO') {contName = 'Nitric Oxide (NO)'}
    else if (selCont === 'NO2') {contName = 'Nitrogen Dioxide (NO<sub>2</sub>)'}
    else if (selCont === 'NOX') {contName = 'Nitrogen Oxide Pollutants (NO<sub>X</sub>)'}
    else if (selCont === 'SO2') {contName = 'Sulfur Dioxide (SO<sub>2</sub>)'}
    d3.select('#date-counter').html(`<h5>January 1, 2016</h5>`);
    d3.select('#contaminant-name').html(`<h4>${contName}</h4>`)
    createContaminantLayer(selCont, '01/01/2016');
    createEmergenciesLayer("1/1/2016")
}


// -------------------------
// | Contaminant Selection |
// -------------------------

// Button to START animation
var startButton = d3.select('#button1');
startButton.on("click", (e) => {
    var stopAnimation = false;
    console.log(d3.event.target);
    console.log(e);
    animatedLoop();
});

// Button to STOP animation
var stopButton = d3.select('#button2');
stopButton.on("click", (e) => {
    for (i = 0; i < arrays.length; i++) {
        clearTimeout(arrays[i]);
    }
});

init();