const GPSCenter = [-4.773737,37.884132];
const workshopName = "cordoba";
var soundLayer;
var imageLayer;
var surveyLayer;
var pathLayer;

$(document).ready(function(){
  var center = toLatLon(GPSCenter);
  var map = L.map('map', {
    center: center,
    zoom: 14,
    minZoom: 14,
    maxZoom: 20
  });

  map.setMaxBounds(map.getBounds());
  postsLayer = L.layerGroup().addTo(map);
  soundLayer = L.layerGroup().addTo(map);
  imageLayer = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    maxClusterRadius: 20,
    spiderfyDistanceMultiplier: 0.5,
    iconCreateFunction: function(cluster) {
      return new L.DivIcon({ 
        html: '<div style="margin-left: auto;margin-right: auto;padding:0;height:100%;width:100%;font-weight:bold;align-content: center;">' + cluster.getChildCount() + '</div>', 
        className: 'marker-cluster', 
        iconSize: new L.Point(24, 24) 
      });
    }
  }).addTo(map);

  videoLayer = L.layerGroup().addTo(map);
  surveyLayer = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    maxClusterRadius: 20,
    spiderfyDistanceMultiplier: 0.5,
    iconCreateFunction: function(cluster) {
      return new L.DivIcon({ 
        html: '<div style="margin-left: auto;margin-right: auto;padding:0;height:100%;width:100%;font-weight:bold;align-content: center;">' + cluster.getChildCount() + '</div>', 
        className: 'marker-cluster', 
        iconSize: new L.Point(24, 24) 
      });
    }
  }).addTo(map);
  pathLayer  = L.layerGroup().addTo(map);
  
  // plazas = L.layerGroup().addTo(map);
  // casasPatios = L.layerGroup().addTo(map);
  patios = L.layerGroup().addTo(map);
  parcelas = L.layerGroup();

  addBackgroundTiles(map);

  loadGoogleMyMap(map);
  loadDariahJSON(map, "cordoba");
  loadTypeformJSON(map);
  loadRawFiles(map);

  loadShapeFile(pathLayer, "gis/plazas.geojson");
  loadShapeFile(pathLayer, "gis/casas_patio.geojson");
  loadShapeFile(patios, "gis/patios.geojson", {
    "color": "#4B9CD3", // line color #4B9CD3
    "weight": .25, // line weight
    "fillColor": "#B7CAE2", // polygon fill color
    "fillOpacity": 0.25 // polygon fill opacity
  });
  loadShapeFile(parcelas, "gis/parcelas.geojson",{
    "color": "#4B9CD3", // line color
    "weight": 0, // line weight
    "fillColor": "#B7CAE2", // polygon fill color
    "fillOpacity": 0.25 // polygon fill opacity
  });

  map.setZoom(15);
    var mapLayers = {
      "Survey": surveyLayer,
      "Text Posts": postsLayer,
      "Audio": soundLayer,
      "Photos": imageLayer,
      "Video": videoLayer,
      
      "Path": pathLayer,
      
      // "Plazas": plazas,
      // "Casa Patios":casasPatios,
      "Patios, todos": patios,
      "Parcelas Conjunto Historico":parcelas
    };

// Create the layer control
var legend = L.control.layers(
  null, 
  mapLayers, 
  {
    position: "topleft",
    // "Survey": true,
    // "Text Posts": true,
    // "Audio": true,
    // "Photos": true,
    // "Video": true,
    // "Path": false,
    // "Patios, todos": true,
    "Parcelas Conjunto Historico": false
  },
  ).addTo(map);

  setLanguageToggleVisible(true);

});

function setLanguageToggleVisible(bool){                
  var langBtn = document.getElementById('lang-btn');
  langBtn.style.display = bool?'block':'none';
  var closeBtn = document.getElementById('close-btn');
  closeBtn.style.display = bool?'none':'block';


}

function addBackgroundTiles(map){
  //https://leaflet-extras.github.io/leaflet-providers/preview/
  var CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
  }).addTo(map);
}

function toLatLon(lonLat) {
  return [lonLat[1], lonLat[0]];
}

//#region Icon Cache
var iconSize = 40;
var iconSizeHovered = 42;
var shadowURL = '';
var shadowSize = [0,0];
var shadowAnchor = [0,0];

// Define your icon styles
var photos = {
  regular: {
      iconUrl: 'assets/photos.png',
      iconSize: [iconSize, iconSize],
      iconAnchor: [(iconSize/2), iconSize],
      popupAnchor: [0, (-iconSize*5/6)],
      shadowUrl: shadowURL,
      shadowSize: shadowSize,
      shadowAnchor: shadowAnchor
    },
  highlighted: {
      iconUrl: 'assets/photos.png',
      iconSize: [iconSizeHovered, iconSizeHovered],
      iconAnchor: [(iconSizeHovered/2), iconSizeHovered],
      popupAnchor: [0, (-iconSizeHovered*5/6)],
      shadowUrl: '',
      shadowSize: [0, 0],
      shadowAnchor: [0, 0]
    }
};
var speech = {
  regular: {
      iconUrl: 'assets/speech.png',
      iconSize: [iconSize, iconSize],
      iconAnchor: [(iconSize/2), iconSize],
      popupAnchor: [0, (-iconSize*5/6)],
      shadowUrl: shadowURL,
      shadowSize: shadowSize,
      shadowAnchor: shadowAnchor
    },
  highlighted: {
      iconUrl: 'assets/speech.png',
      iconSize: [iconSizeHovered, iconSizeHovered],
      iconAnchor: [(iconSizeHovered/2), iconSizeHovered],
      popupAnchor: [0, (-iconSizeHovered*5/6)],
      shadowUrl: '',
      shadowSize: [0, 0],
      shadowAnchor: [0, 0]
    }
};
var survey = {
  regular: {
      iconUrl: 'assets/survey.png',
      iconSize: [iconSize, iconSize],
      iconAnchor: [(iconSize/2), iconSize],
      popupAnchor: [0, (-iconSize*5/6)],
      shadowUrl: shadowURL,
      shadowSize: shadowSize,
      shadowAnchor: shadowAnchor
    },
  highlighted: {
      iconUrl: 'assets/survey.png',
      iconSize: [iconSizeHovered, iconSizeHovered],
      iconAnchor: [(iconSizeHovered/2), iconSizeHovered],
      popupAnchor: [0, (-iconSizeHovered*5/6)],
      shadowUrl: '',
      shadowSize: [0, 0],
      shadowAnchor: [0, 0]
    }
};
var comment = {
  regular: {
      iconUrl: 'assets/comment.png',
      iconSize: [iconSize, iconSize],
      iconAnchor: [(iconSize/2), iconSize],
      popupAnchor: [0, (-iconSize*5/6)],
      shadowUrl: shadowURL,
      shadowSize: shadowSize,
      shadowAnchor: shadowAnchor
    },
  highlighted: {
      iconUrl: 'assets/comment.png',
      iconSize: [iconSizeHovered, iconSizeHovered],
      iconAnchor: [(iconSizeHovered/2), iconSizeHovered],
      popupAnchor: [0, (-iconSizeHovered*5/6)],
      shadowUrl: '',
      shadowSize: [0, 0],
      shadowAnchor: [0, 0]
    }
};
var video = {
  regular: {
      iconUrl: 'assets/video.png',
      iconSize: [iconSize, iconSize],
      iconAnchor: [(iconSize/2), iconSize],
      popupAnchor: [0, (-iconSize*5/6)],
      shadowUrl: shadowURL,
      shadowSize: shadowSize,
      shadowAnchor: shadowAnchor
    },
  highlighted: {
      iconUrl: 'assets/video.png',
      iconSize: [iconSizeHovered, iconSizeHovered],
      iconAnchor: [(iconSizeHovered/2), iconSizeHovered],
      popupAnchor: [0, (-iconSizeHovered*5/6)],
      shadowUrl: '',
      shadowSize: [0, 0],
      shadowAnchor: [0, 0]
    }
};
var locPin = {
  regular: {
      iconUrl: 'assets/location.png',
      iconSize: [iconSize/2, iconSize/2],
      iconAnchor: [(iconSize/4), (iconSize/2)],
      popupAnchor: [0, (-iconSize*5/12)],
      shadowUrl: shadowURL,
      shadowSize: shadowSize,
      shadowAnchor: shadowAnchor
    },
  highlighted: {
    iconUrl: 'assets/location.png',
    iconSize: [iconSizeHovered/2, iconSizeHovered/2],
    iconAnchor: [(iconSizeHovered/4), (iconSizeHovered/2)],
    popupAnchor: [0, (-iconSizeHovered*5/12)],
    shadowUrl: shadowURL,
    shadowSize: shadowSize,
    shadowAnchor: shadowAnchor
    }
};

// Cache the regular and highlighted icon instances for each icon style
var iconCache = {
  audio: {
    regular: L.icon(speech.regular),
    highlighted: L.icon(speech.highlighted)
  },
  image: {
    regular: L.icon(photos.regular),
    highlighted: L.icon(photos.highlighted)
  },
  survey: {
    regular: L.icon(survey.regular),
    highlighted: L.icon(survey.highlighted)
  },
  comment: {
    regular: L.icon(comment.regular),
    highlighted: L.icon(comment.highlighted)
  },
  video:{
    regular: L.icon(video.regular),
    highlighted: L.icon(video.highlighted)
  },
  location:{
    regular: L.icon(locPin.regular),
    highlighted: L.icon(locPin.highlighted)
  }
};

function fileArrayToIcon(post){
  var tags = [];
  var files = post.files;

  if(files == null){
    tags.push("comment");
    post.tags = tags;
    return iconCache.comment;
  }
  
  for (let i = 0; i < files.length; i++) {
    const audioExtension = files[i].match(/\.(mp3|wav|ogg|flac|m4a)$/i);
    if (audioExtension) {
      tags.push("audio");
      continue;
    }
    
    const imageExtension = files[i].match(/\.(jpg|jpeg|png|gif)$/i);
    if (imageExtension) {
      tags.push("image");
      continue;
    }
    const videoExtension = files[i].match(/\.(mp4|mkv|mpeg|mov|webm)$/i);
    if (videoExtension) {
      tags.push("video");
      continue;
    }
  }
  post.tags = tags;

  if (post.tags.includes("video")) {
    return iconCache.video;
  } 
  else if (post.tags.includes("audio")) {
    return iconCache.audio;
  }
  else if (post.tags.includes("image")) {
    return iconCache.image;
  } else {
    return iconCache.comment;
  }
}
//#endregion

function loadGoogleMyMap(map) {
  var myMapUrl = 'google/PatioWalk.kml';
  
  // Load the KML and add it to the map
  var runLayer = omnivore.kml(myMapUrl).on('ready', function() {

    function highlightMarker(e) {
      var marker = e.target;
      marker.setIcon(iconCache.location.highlighted);
      marker.setZIndexOffset(1000);
    }
    
    // Define a function to reset the marker's style when the mouse leaves it
    function resetMarker(e) {
      var marker = e.target;
      marker.setIcon(iconCache.location.regular);
      marker.setZIndexOffset(0);

    }

    // After the 'ready' event fires, the GeoJSON contents are accessible
    // and you can iterate through layers to bind custom popups.
    runLayer.eachLayer(function(layer) {

        var markerIcon = iconCache.location.regular;
        if (layer instanceof L.Marker) {
          layer.setIcon(markerIcon);

        layer.on('mouseover', highlightMarker);
        layer.on('mouseout', resetMarker);
        
        
          // Create a popup
          var popup = L.popup({
            closeButton: false,
            className: 'my-popup'
          }).setContent(layer.feature.properties.name);
        
        // Add the popup to the marker on hover
        layer.on('mouseover', function (e) {
            this.openPopup();
          }).on('mouseout', function (e) {
            this.closePopup();
          }).bindPopup(popup);
        // See the `.bindPopup` documentation for full details. This
        // dataset has a property called `name`: your dataset might not,
        // so inspect it and customize to taste.
        // layer.bindPopup(layer.feature.properties.name);
        }
      
    });
})
.addTo(pathLayer);
}
function loadShapeFile(myLayer, geoJsonUrl, myStyle){
  if(myStyle === undefined){
    myStyle = {
      "color": "#4B9CD3", // line color
      "weight": 1, // line weight
      "fillColor": "#B7CAE2", // polygon fill color
      "fillOpacity": 0.5 // polygon fill opacity
    };
  }
// Create a Leaflet GeoJSON layer
var loaded = L.geoJSON(null, {
  style: myStyle
});

// Load the GeoJSON data
$.getJSON(geoJsonUrl, function(data) {
  loaded.addData(data);
});

// Add the layer to the map
loaded.addTo(myLayer);
}

function loadDariahJSON(map, workshopName) {
  $.getJSON('dariahcloud/cordoba/goblet-archive.json', function(data) {
    // var markers = [];

    $.each(data.posts, function(key, val) {
      if (key === workshopName) {
        $.each(val, function(key, post) {
          if (post.long === undefined || post.lat === undefined || post.long === 0 || post.lat === 0 || post.long === '' || post.lat === '') {
            post.long = GPSCenter[0] + (Math.random() * 0.0002 - 0.0001);
            post.lat = GPSCenter[1] + (Math.random() * 0.0002 - 0.0001);
          }

          var posticon = fileArrayToIcon(post);
          
          function highlightMarker(e) {
            var marker = e.target;
            marker.setIcon(posticon.highlighted);
            marker.setZIndexOffset(1000);
          }
          
          // Define a function to reset the marker's style when the mouse leaves it
          function resetMarker(e) {
            var marker = e.target;
            marker.setIcon(posticon.regular);
            marker.setZIndexOffset(0);
          }

          var marker = L.marker([post.lat, post.long], {
            icon: posticon.regular,
            title: post.title
          });

          function clickMarker(){
            dariahCloudToSidebar(post);
          }

          // Add event listeners to the marker
          marker.on('mouseover', highlightMarker);
          marker.on('mouseout', resetMarker);
          marker.on('click',clickMarker);
          if (post.tags.includes("comment")) {
            marker.addTo(postsLayer);
          } 
          if (post.tags.includes("video")) {
            marker.addTo(videoLayer);
          } 
          if (post.tags.includes("audio")) {
            marker.addTo(soundLayer);
          }
          if (post.tags.includes("image")) {
            marker.addTo(imageLayer);
          } 
        
        });
      } else {
        console.log('skipping dariahcloud workshop: ' + key);
      }
    });

    // markers.addTo(visualLayer);
  });
}

function loadRawFiles(map) {
  $.getJSON('rawMedia/geotagged_files.json', function(data) {

        $.each(data, function(key, post) {
          if (post.long === undefined || post.lat === undefined || post.long === 0 || post.lat === 0 || post.long === '' || post.lat === '') {
            post.long = GPSCenter[0] + (Math.random() * 0.0002 - 0.0001);
            post.lat = GPSCenter[1] + (Math.random() * 0.0002 - 0.0001);
          }
          // console.log(post);
          //var posticon = fileArrayToIcon(post);
          var posticon = iconCache.image;

          function highlightMarker(e) {
            var marker = e.target;
            marker.setIcon(posticon.highlighted);
            marker.setZIndexOffset(1000);
          }
          
          // Define a function to reset the marker's style when the mouse leaves it
          function resetMarker(e) {
            var marker = e.target;
            marker.setIcon(posticon.regular);
            marker.setZIndexOffset(0);
          }

          var marker = L.marker([post.lat, post.long], {
            icon: posticon.regular,
            title: "Raw Media"
          });

          function clickMarker(){
            // dariahCloudToSidebar(post);
            rawMediaToSidebar(post);
          }

          // Add event listeners to the marker
          marker.on('mouseover', highlightMarker);
          marker.on('mouseout', resetMarker);
          marker.on('click',clickMarker);
          if (post.tags.includes("comment")) {
            marker.addTo(postsLayer);
          } 
          if (post.tags.includes("video")) {
            marker.addTo(videoLayer);
          } 
          if (post.tags.includes("audio")) {
            marker.addTo(soundLayer);
          }
          if (post.tags.includes("image")) {
            marker.addTo(imageLayer);
          } 
        
        });
      
    });
}

function loadTypeformJSON(map){
var markers = [];
var placeDict = {};
$.getJSON("typeform/Cordoba-2022-es/Cordoba-Results-2022.json", function(data) {
  
  //build a location tag dictionary so we can move pins without a GPS position
  $.each(data, function(key, val) {
    var tag = val['location-tag'];
    if(tag === undefined || tag === "" || val.long === undefined || val.lat === undefined || val.long === 0 || val.lat === 0 || val.long === "" || val.lat === ""){}
    else{
      if (!placeDict.hasOwnProperty(tag)) {
        placeDict[tag] = [val.long, val.lat];
      }
    }
  });

  $.each(data, function(key, val) {
    if(val.long === undefined || val.lat === undefined || val.long === 0 || val.lat === 0 || val.long === "" || val.lat === ""){
      var tag = val['location-tag'];
      if(placeDict.hasOwnProperty(tag)){
        val.long = placeDict[tag][0]+ (Math.random() * 0.0002 - 0.0001);
        val.lat = placeDict[tag][1]+ (Math.random() * 0.0002 - 0.0001);
      }
      else{
        val.long = GPSCenter[0]+ (Math.random() * 0.0002 - 0.0001);
        val.lat = GPSCenter[1]+ (Math.random() * 0.0002 - 0.0001);
      }

    }
    var posticon = iconCache.survey;
          function highlightMarker(e) {
            var marker = e.target;
            marker.setIcon(posticon.highlighted);
            marker.setZIndexOffset(1000);
          }
          
          // Define a function to reset the marker's style when the mouse leaves it
          function resetMarker(e) {
            var marker = e.target;
            marker.setIcon(posticon.regular);
            marker.setZIndexOffset(0);
          }

          var marker = L.marker([val.lat, val.long], {
            icon: posticon.regular,
            title: val.title
          });

          function clickMarker(){
            typeformToSidebar(val);
          }
    var marker = L.marker([val.lat, val.long], {
      icon: posticon.regular,
      title: val.title
    });
    
    // Add event listeners to the marker
    marker.on('mouseover', highlightMarker);
    marker.on('mouseout', resetMarker);
    marker.on('click',clickMarker);
    marker.addTo(surveyLayer);
    // markers.push(marker);

  });
  // L.layerGroup(markers).addTo(map);
});
}

//#region HTML Rendering for Sidebar
async function GenerateDariahCloudHTML(post){
  var sidebarHTML = '<h2>' + toTitleCase(post.title) + '</h2>';
    //if post.tag is defined, do a readout of the tag
    if (post.tag !== undefined && post.tag !== ""){
        sidebarHTML += '<p id=tags>' + "Tag: " +RemoveHyphensAndTitleCase(post.tag) + '</p>';
    }
    sidebarHTML += '<p id=date>' + timeStampToDate(convertToCET(post.timestamp)) + '</p>';
    if(post.text !== undefined)sidebarHTML += '<p>' + post.text + '</p>';
    var files = post.files;
    //if its defined, do a readout of the files
    if (files === undefined) {
        //sidebarHTML += '<p>No files</p>';
    } else {
    for (var i = 0; i < files.length; i++) {
            sidebarHTML += await createMediaHTML("dariahcloud/"+files[i]);
        }
    }
    return sidebarHTML;
}
//#region HTML Rendering for Sidebar
async function GenerateRawMediaHTML(post){
  var sidebarHTML = '<h2>' + toTitleCase(post.title) + '</h2>';
    //if post.tag is defined, do a readout of the tag
    if (post.tag !== undefined && post.tag !== ""){
        sidebarHTML += '<p id=tags>' + "Tag: " +RemoveHyphensAndTitleCase(post.tag) + '</p>';
    }
    sidebarHTML += '<p id=date>' + timeStampToDate(convertToCET(post.timestamp)) + '</p>';
    if(post.text !== undefined)sidebarHTML += '<p>' + post.text + '</p>';
    var files = post.files;
    //if its defined, do a readout of the files
    if (files === undefined) {
        //sidebarHTML += '<p>No files</p>';
    } else {
    for (var i = 0; i < files.length; i++) {
      // console.log(files[i]);
            sidebarHTML += await createMediaHTML(files[i]);
        }
    }
    return sidebarHTML;
}


const emailRegex = /\b[\w\.-]+@[\w\.-]+\.\w{2,}\b/;
async function GenerateTypeformHTML(post){
  var sidebarHTML = "<h2>Survey Results</h2>";
  function removeDisambiguator(inputString){
    var parts = inputString.split("__");
    return parts[0];
  }
  for (var key in post) {
    //if key matches a block, skip it
    if (key === "id" || key === "lat" 
    || key === "long" || key === "Network ID" 
    || key === "t"|| key === "#"|| key === "geometry" || key === "Start Date (UTC)"
    || key === "¿Le importaría compartir su dirección de correo electrónico?" || key == "type" || key == "selectable") continue;
    //if we have an email in our response
    
    
    var cleanKeyName = removeDisambiguator(key);
      if (post.hasOwnProperty(key) && post[key]) {
        value = post[key];
        if (emailRegex.test(value))continue;
        var fileName = checkForFileLink(value);
        if (fileName) {
            fileName = reformatFileLink(fileName,post['#']);
            
            sidebarHTML += "<strong style='font-weight: bold'>" 
            + cleanKeyName + ":</strong><br><br>";
            sidebarHTML += await createMediaHTML(fileName);
            sidebarHTML += "<br>";
        }
        else{
          sidebarHTML += "<div class='keyitem'>" 
          + cleanKeyName + ":</strong></div><br><div class='indent'>" + value + "</div><br>";
        }
        
      }
  }
  return sidebarHTML;
}
const loadingString = "<h1 class='magic'><span class='magic-text'>LOADING...</span></h1>";
async function typeformToSidebar(post) {
  setLanguageToggleVisible(false);
  await updateSidebar("#sidebar", loadingString);
  html = await GenerateTypeformHTML(post);
  await updateSidebar("#sidebar", html);

}
async function dariahCloudToSidebar(post) {
  setLanguageToggleVisible(false);
  await updateSidebar("#sidebar", loadingString);
  html = await GenerateDariahCloudHTML(post);
  await updateSidebar("#sidebar", html);
}
async function rawMediaToSidebar(post) {
  setLanguageToggleVisible(false);
  await updateSidebar("#sidebar", loadingString);
  html = await GenerateRawMediaHTML(post);
  await updateSidebar("#sidebar", html);
}
//#endregion

//#region Sidebar
async function updateSidebar(element, content) {
  await fadeOut(element);
  $(element).html(content);
  await fadeIn(element);
}
async function fadeOut(element) {
  return new Promise((resolve) => {
    $(element).fadeOut(100).promise().done(resolve);
  });
}

async function fadeIn(element) {
  return new Promise((resolve) => {
    $(element).fadeIn(100).promise().done(resolve);
  });
}
//#endregion
