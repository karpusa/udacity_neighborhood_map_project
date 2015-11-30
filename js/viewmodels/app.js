define([
    'knockout',
    'config/location',
    'models/location',
    'async!http://maps.google.com/maps/api/js'
], function (ko, ConfigLocation, ModelLocation) {
    'use strict';

    var AppViewModel = function () {
        var self = this;
        self.map = null;

        self.ConfigLocation = ConfigLocation;
        self.locations = ko.observableArray([]);
        self.currentLocation = ko.observable();
        self.searchQuery = ko.observable('');
        self.searchSubmit = ko.observable('');
        self.prevInfoWindow =false;
        self.locationListOpen = ko.observable(true);
        self.toggleLocationButton = ko.computed( function()
        {
            if (self.locationListOpen())
            {
                return "Hide List";
            }
            else
            {
                return "Show List";
            }
        });
        self.locationListClass = ko.computed( function()
        {
            if (self.locationListOpen())
            {
                return "is-open";
            }
            else
            {
                return "is-hide";
            }
        });

        //Initilization APP
        self.init = function () {
            self.initMap();
            self.initLocation();
        };

        //Initilization Google Map API
        self.initMap = function() {
            self.map = new google.maps.Map(document.getElementsByClassName('js-map')[0], {
                center: new google.maps.LatLng(56.9715833, 24.1490803),
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI : true,
            });
        };

        //Get locations from config and add markers to map
        self.initLocation = function() {
            self.ConfigLocation.places.forEach(function(data) {
                self.addLocation(data);
            });
        };

        /**
         * Add marker to map
         * Add event on click marker to open info window
         * Center map on marker
         * Set animation to marker
         */
        self.addLocation = function(data) {
            var latLng = {lat: data.lat, lng: data.lng},
                marker = new google.maps.Marker({
                    position: latLng,
                    map: self.map,
                    title: data.name,
                    icon: 'i/' + data.icon + '.png'
                }),
                ModelLocationData = new ModelLocation( {
                    name : data.name,
                    address : data.address,
                    latLng : latLng,
                    visible : ko.observable(true),
                    marker : marker
                }),
                infowindow = new google.maps.InfoWindow({
                    content: ModelLocationData.info()
                });

            ModelLocationData.infowindow = infowindow;

            marker.addListener('click', function() {
                if(self.prevInfoWindow) {
                    self.prevInfoWindow.close();
                }

                self.prevInfoWindow = infowindow;
                infowindow.open(self.map, marker);
                self.map.panTo(marker.position);
                self.currentLocation(ModelLocationData);
                ModelLocationData.getAdditionInfo();

                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function () {
                    marker.setAnimation(null);
                }, 750);
            });

            self.locations.push(ModelLocationData);
        };

        //Set current location and center map to marker
        self.setCurrentLocation = function(location)
        {
            if (self.currentLocation() !== location)
            {
                google.maps.event.trigger(location.marker, 'click');
                self.map.panTo(location.marker.position);
                self.currentLocation(location);
            }
        };

        // Hide/Show locations list
        self.toggleLocationList = function()
        {
            self.locationListOpen(!self.locationListOpen());
        };

        //Live search, subscribe event to the observable
        self.searchSubmit.subscribe(function (value) {
            var valueSplit = value.toLowerCase().split(' ');

            valueSplit.forEach(function(word) {
                self.locations().forEach(function(location)
                {
                    var name = location.name.toLowerCase(),
                        address = location.address.toLowerCase();

                    if ((name.indexOf(word) === -1) && (address.indexOf(word) === -1))
                    {
                        location.visible(false);
                        location.marker.setVisible(false);
                    }
                    else
                    {
                        location.visible(true);
                        location.marker.setVisible(true);
                    }
                });
            });
        });

        //Run application
        self.init();
    };

    return AppViewModel;
});