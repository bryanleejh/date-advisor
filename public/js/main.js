var map;
var autocomplete;
var geocoder;
var activeActivities = [];
var activity = {};
var tempId;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: { lat: 1.290270, lng: 103.851959 }
  });
  navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
  // Initialise geocoding API
  geocoder = new google.maps.Geocoder();
}

// Create the autocomplete object, restricting the search to geographical
function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(document.getElementsByClassName('autocomplete')[0]),
    {types: ['geocode']});
}

// This is called onfocus
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}

// Create activity on server
function createActivityAjax(lat, lng) {
  activity.name = $('#description').val();
  activity.address = $('#address').val();
  activity.category = $('#category').val();
  activity.lat = lat;
  activity.lng = lng;
  // console.log(activity.name);
  // console.log(activity.address);
  // console.log(activity.category);

  $.ajax({
    method: 'POST',
    url: '/create',
    headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: activity
  }).done(function (activity) {
    console.log('create activity');
  });
}

function createNewActivity(lat, lng) {
  var newActivity = {
    name: $('#description').val(),
    address: $('#address').val(),
    lat: lat,
    lng: lng,
    category: $('#category').val(),
  }

  var contentString = '<div class="iw-description">'+ newActivity.name +'</div><div class="iw-address">Location: '+ newActivity.address +'</div><div class="iw-category">Category: '+ newActivity.category +'</div>'
  var activityMarker = {
    marker: new google.maps.Marker({
      map: map,
      position: { lat: newActivity.lat, lng: newActivity.lng },
    }),
    iw: new google.maps.InfoWindow({
      content: contentString
    })
  }

  // add listener to this event's marker
  activityMarker.marker.addListener('click', function () {
    activityMarker.iw.open(map, activityMarker.marker);
    $('#description').val(activity.name);
    $('#address').val(activity.address);
    $('#category').val(activity.category);
  });

  activityMarker.iw.addListener('closeclick', function () {
    console.log('closed');
    $('#description').val('');
    $('#address').val('');
    $('#category').val('');
  });

  createActivityAjax(lat, lng);
  $('#description').val('');
  $('#address').val('');
  $('#category').val('');
}

function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
      createNewActivity(results[0].geometry.location.lat(), results[0].geometry.location.lng());
    }

    else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function locationError() {
  console.log("Could Not Find Current Location");
}

function locationSuccess(position) {
  var current = { lat: position.coords.latitude, lng: position.coords.longitude };
  map.setCenter(current);
  map.setOptions({ zoom: 15 });

  var marker = new google.maps.Marker({
    position: current,
    map: map,
    icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
  });
}

function addMarkers(map) {
  $.ajax({
    method: 'GET',
    url: '/getactivities',
    headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    }
  }).done(function (data) {
    console.log('addAllMarkers');
    var tempArray = [];
    // console.log(data);
    data.forEach((activity, index) => {
      // console.log(activity);
      var contentString = '<div class="iw-description">Activity: '+ activity.name +'</div><div class="iw-address">Location: ' + activity.address + '</div><div class="iw-category">Category: ' + activity.category + '</div>'
      // console.log(activity._id);
      var activityMarker = {
        id: activity._id,
        marker: new google.maps.Marker({
          map: map,
          position: {lat: activity.lat, lng: activity.lng},
        }),
        iw: new google.maps.InfoWindow({
          content: contentString
        })
      };
      // console.log(activityMarker.activity.id); // id was actually named _id
      // console.log(activityMarker);

      // add listener to this marker
      activityMarker.marker.addListener('click', function () {
          activityMarker.iw.open(map, activityMarker.marker);
          // and also populate the form with details to edit
          $('#description').val(activity.name);
          $('#address').val(activity.address);
          $('#category').val(activity.category);
          tempId = activity._id;
          console.log(tempId);
      });

      activityMarker.iw.addListener('closeclick', function () {
        console.log('closed');
        $('#description').val('');
        $('#address').val('');
        $('#category').val('');
      });

      tempArray.push(activityMarker);
    })
    activeActivities = tempArray;
    console.log(activeActivities);
    console.log('markers loaded');
  });
  // var marker = new google.maps.Marker({
  //   map: resultsMap,
  //   position: results[0].geometry.location
  // });
}

function updateMarker(lat, lng) {
  var activity = {};
  activity.name = $('#description').val();
  activity.address = $('#address').val();
  activity.category = $('#category').val();
  activity.lat = lat;
  activity.lng = lng;
  activity.id = tempId;
  console.log(tempId + 'tempID is here');

  $.ajax({
    method: 'PUT',
    url: '/editactivities/',
    headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: activity
  }).done(function (data) {
    console.log(data);
    console.log('update activity');
    var newActivity = {
      name: $('#description').val(),
      address: $('#address').val(),
      lat: lat,
      lng: lng,
      category: $('#category').val(),
    }

    var contentString = '<div class="iw-description">'+ newActivity.name +'</div><div class="iw-address">Location: '+ newActivity.address +'</div><div class="iw-category">Category: '+ newActivity.category +'</div>'
    for (i = 0; i<activeActivities.length; i++) {
      if (activeActivities[i].id == tempId) {
        activeActivities[i].iw.close();
        console.log('maybe');
        var activityMarker = activeActivities[i];
        activityMarker = {
          marker: new google.maps.Marker({
            map: map,
            position: { lat: newActivity.lat, lng: newActivity.lng },
          }),
          iw: new google.maps.InfoWindow({
            content: contentString
          })
        }

        // add listener to this event's marker
        activityMarker.marker.addListener('click', function () {
          activityMarker.iw.open(map, activityMarker.marker);
          $('#description').val(activity.name);
          $('#address').val(activity.address);
          $('#category').val(activity.category);
        });

        activityMarker.iw.addListener('closeclick', function () {
          console.log('closed');
          $('#description').val('');
          $('#address').val('');
          $('#category').val('');
        });
        activeActivities[i].iw.open();
        break;
      }
    }
  });
  // addMarkers(map);
}

function geocodeUpdateAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
      updateMarker(results[0].geometry.location.lat(), results[0].geometry.location.lng());
    }
    else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });

}

function deleteMarker() {
  var activity = {};
  activity.id = tempId;

  $.ajax({
    method: 'DELETE',
    url: '/deleteactivities/',
    headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
    data: activity
  }).done(function (data) {
    console.log(data);
    console.log('delete activity');
    for (i = 0; i<activeActivities.length; i++) {
      if (activeActivities[i].id == tempId) {
        activeActivities[i].iw.close();
        activeActivities.splice(i, 1);
        break;
      }
    }

  });
}

function clearMarkers() {
  activeActivities = [];
}

function setupListeners() {
  document.getElementById('submit').addEventListener('click', function(e) {
    e.preventDefault();
    geocodeAddress(geocoder, map);
    // console.log('submit works');
  });

  document.getElementById('refresh').addEventListener('click', function(e) {
    e.preventDefault();
    addMarkers(map);
    console.log(activeActivities);
    // console.log('refresh works');
  });

  document.getElementById('update').addEventListener('click', function(e) {
    e.preventDefault();
    geocodeUpdateAddress(geocoder, map);
    location.reload();
    // updateMarker();
    console.log(activeActivities);
    console.log('update works');
  });

  document.getElementById('delete').addEventListener('click', function(e) {
    e.preventDefault();
    deleteMarker();
    location.reload();
    // addMarkers(map);
    // console.log('delete works');
  });
}

$(document).ready(function () {
  initMap();
  initAutocomplete();
  setupListeners();
  addMarkers(map);
});
