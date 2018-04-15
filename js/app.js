  //Array of location objects
     var locations = [
         {	name: "Moreno's Mexican Grill",
     			description: "Dine in restaurant",
     			location: {lat: 33.40821, lng: -111.814599},
     			address: "760 E Broadway Rd, Mesa, AZ 85204",
          url: "",
          error: "",
     			flickrID: "41400434662"},

     		{	name: "La Estrella Panaderia",
     			description: "Dine in restaurant",
          location: {lat: 33.407547, lng: -111.813444},
     			address: "819 E Broadway Rd, Mesa, AZ 85204",
          url: "",
          error: "",
     			flickrID: "40542328035"},

     		{	name: "Tortas La Presa",
     			description: "Dine in restaurant",
          location: {lat: 33.407667, lng: -111.814356},
     			address: "767 E Broadway Rd, Mesa, AZ 85204",
          url: "",
          error: "",
     			flickrID: "27559856198"},

     		{	name: "Lowell Elementary School",
     			description: "Neighborhood Elementary School",
          location: {lat: 33.409462, lng: -111.811548},
     			address: "920 E Broadway Rd, Mesa, AZ 85204",
          url: "",
          error: "",
     			flickrID: "15979377316"},

     		{	name: "Mesa Fire Department",
     			description:  "Local fire department",
          location: {lat: 33.399875, lng: -111.806042},
     			address: "830 S Stapley Dr, Mesa, AZ 85204",
          url: "",
          error: "",
     			flickrID: "8204404134"},

     		{	name: "Reed Park",
     			description: "Local park, popular hang out spot",
          location: {lat: 33.406036, lng: -111.795761},
     			address: "1631 E Broadway Rd, Mesa, AZ 85204",
          url: "",
          error: "",
     			flickrID: "38862254810"},

     		{	name:  "Food City",
     			description: "Neighborhood grocery store",
          location: {lat: 33.393342, lng: -111.821808},
     			address: "450 E Southern Ave, Mesa, AZ 85204",
          url: "",
          error: "",
     			flickrID: "12126133156"},

     		{name: "Fountain Plaza Skatepark",
         description: "Nice skatepark near the corner store",
         location: {lat: 33.392898, lng: -111.822382},
         address: "417 E Southern Ave, Mesa, AZ 85204",
         url: "",
         error: "",
         flickrID: "9598558585"}
     	];

      var map;
      var infoWindow;
      var places = [];
      var bounds;

      // Constructor creates a new map - only center and zoom are required.
      function initMap() {
        var mapOptions = {
			       center: new google.maps.LatLng(33.40821,-111.814599),
			       zoom: 15,
			       mapTypeControl: true,
			       mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
			       navigationControl: true,
			       mapTypeID: google.maps.MapTypeId.ROADMAP
		    };

        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        infoWindow = new google.maps.InfoWindow();
        bounds = new google.maps.LatLngBounds();
        addMarker();
      }

      function addMarker() {

        //For each object in the locations array, create a marker
        locations.forEach(function(place) {
          //Flickr api ajax request
          $.ajax ({
          	type:  "GET",
          	dataType: "json",
          	url: 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&nojsoncallback=1&format=json',
            data: { api_key: '717738739d4f8237f944f108fb54f963', photo_id: place.flickrID },
            aync: true,
            //Sets location url to flickr image url
          	success: function(data) {
              var photo = data.photo;
          		place.url = "https://farm" + photo.farm + ".staticflickr.com/" +  photo.server + "/" + photo.id + "_" + photo.secret + "_b.jpg";
          	},
          	error: function(data) {
          		//Call back in case of error
          		alert("Could not load data from flickr");
              place.error = 'No pic available';
          	}
          });

          var marker = new google.maps.Marker({
  				position: new google.maps.LatLng(place.location),
  				map: map,
  				title: place.name,
  				draggable: false,
  				animation: google.maps.Animation.DROP,
  				info: place.description,
  				rating: place.rating,
  				listClick: function(thisMarker){
  					infowindow.setContent('<div>' + place.name + '</div>' + '<div>' + place.address + '</div>' + '<p>' + place.description + '</p>' + '<img class="infopic" src="' + place.url + '" />' + '<div>' + place.error + '</div>');
  					infowindow.open(map, thisMarker);
  				}
  			});

			   bounds.extend(marker.position);

			   place.marker = marker;

        //On click, sets content of infoWindow to the selected marker and plays
        //a bounce animation on the marker
			  google.maps.event.addListener(marker, 'click', function() {
				infoWindow.setContent('<div>' + place.name + '</div>' + '<div>' + place.address + '</div>' + '<p>' + place.description + '</p>' + '<img class="infopic"  src="' + place.url + '" />' + '<div>' + place.error + '</div>');
				infoWindow.open(map, this);
				toggleBounce(marker);
			  });
		   });

       map.fitBounds(bounds);
      }

      //Plays bounce animation when marker is clicked
      function toggleBounce(marker) {
      		marker.setAnimation(google.maps.Animation.BOUNCE);
      		window.setTimeout(function() {
      			marker.setAnimation(null);
      		}, 2100);
      	}

      var viewModel = function() {
        var self = this;
        self.placeArray = ko.observableArray(locations);
        self.query = ko.observable('');
        self.place = ko.observable('-');

        //Search function, hides/shows markers that meet search criteria
        self.search = function(value) {
          self.placeArray([]);
          for(var x in locations) {
            if(locations[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0)
            {
              self.placeArray.push(locations[x]);
              locations[x].marker.setVisible(true);
            }
            else locations[x].marker.setVisible(false);
          }
      };
      self.query.subscribe(self.search);

      //Centers screen over selected marker and displays infowindow
      self.select = function(loc){
        self.place(loc);
        var myLatLng = new google.maps.LatLng(self.place().location);
        var newCenter = new google.maps.LatLng(self.place().location);
        map.panTo(newCenter);
        google.maps.event.trigger(loc.marker, 'click');
      };

    };

    //Slides menu in/out of view
      function toggleMenu(x) {
        if (x == 0) {
          $("#menu").animate({left: 0});
        }
        if (x == 1) {
          $("#menu").animate({left: -1000});
        }
      }

      //initializes view model
      ko.applyBindings(new viewModel());

      //Alerts user if google maps fails to load
      function googleError() {
    		alert('Google Failed');
    	}
