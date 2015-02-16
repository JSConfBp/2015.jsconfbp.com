var markers = [], blueIcon = {}, map = null, map_canvas = document.getElementById('map-canvas');

function load_GMaps() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
    'callback=initialize_gmap';
  document.body.appendChild(script);
}

function initialize_gmap() {
  // Set the map options
  mapOptions = {
    zoom: 15,
    center: new google.maps.LatLng(47.496177, 19.056338),
    scrollwheel: false
  }; 

  var map = new google.maps.Map(map_canvas, mapOptions);

  markers = [
    {
      name: "The Venue",
      website: null,
      position:  new google.maps.LatLng(47.496177, 19.056338),
      is_the_venue: true
    },
    {
      name: "Astoria City Hostel",
      website: "http://astoriacityhostel.com/",
      position:  new google.maps.LatLng(47.4946125,19.0605384)
    },
    {
      name: "Hostel Budapest Center",
      website: "http://www.hostelbudapestcenter.com/",
      position:  new google.maps.LatLng(47.4942958,19.0584411)
    },
    {
      name: "Hotel Ambra",
      website: "http://hotelambra.hu/en",
      position:  new google.maps.LatLng(47.5008749,19.0617632)
    },
    {
      name: "Roombach Hotel",
      website: "http://www.roombachhotel.com/",
      position:  new google.maps.LatLng(47.4978693,19.0581532)
    },
    {
      name: "Le Meridien Budapest",
      website: "http://www.lemeridienbudapest.com/",
      position:  new google.maps.LatLng(47.4975091,19.0531563)
    },
    {
      name: "Kempinski Hotel Corvinus",
      website: "http://www.kempinski.com/en/budapest/hotel-corvinus/welcome/",
      position:  new google.maps.LatLng(47.4973119,19.0522282)
    },
    {
      name: "Regency Hotel Budapest",
      website: "http://regencyhotelbudapest.com/",
      position:  new google.maps.LatLng(47.4972922,19.057195)
    }
  ];

  blueIcon = {
    url: 'http://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png',
    size: new google.maps.Size(22, 40)
  }

  for (i in markers) {
    var _marker = markers[i];

    _marker.marker = new google.maps.Marker({
      draggable: false,
      map: map,
      icon: (_marker.is_the_venue ? null : blueIcon),
      position: _marker.position,
      title: _marker.name
    });
    _marker.marker.parent = _marker;

    _marker.infowindow = new google.maps.InfoWindow({
      content: (_marker.is_the_venue ? '<strong>' + _marker.name + '</strong>' : '<a href="' + _marker.website + '" target="_blank">' + _marker.name + '</a>')
    });

    google.maps.event.addListener(_marker.marker, 'click', function() {
      // Close other open windows.
      for (i in markers) {
        markers[i].infowindow.close();
      }

      this.parent.infowindow.open(map, this);
    });
  }
}

if( map_canvas ){
  load_GMaps();
}
