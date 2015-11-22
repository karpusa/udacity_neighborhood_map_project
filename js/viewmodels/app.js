define([
    'knockout',
    'config/location',
    'models/location',
    'async!http://maps.google.com/maps/api/js'
], function (ko, ConfigLocation, ModelLocation) {
    'use strict';

    var AppViewModel = function () {
        var self = this;
        self.map;

        self.ConfigLocation = ConfigLocation;
        self.locations = ko.observableArray([]);

        this.searchQuery = ko.observable("");
        self.searchWords = ko.computed( function()
        {
            return self.searchQuery().toLowerCase().split(' ');
        });

        self.init = function () {
            self.initMap();
            self.initLocation();
        };

        self.initMap = function() {
            self.map = new google.maps.Map(document.getElementsByClassName('js-map')[0], {
                center: new google.maps.LatLng(56.9715833, 24.1090803),
                zoom: 11,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
            });
        };

        self.initLocation = function() {
            self.ConfigLocation.places.forEach(function(data) {
                self.addLocation(data);
            });
        }

        self.addLocation = function(data) {
            var latLng = {lat: data.lat, lng: data.lng},
                marker = new google.maps.Marker({
                    position: latLng,
                    map: self.map,
                    title: data.name
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

            marker.addListener('click', function() {
                infowindow.open(self.map, marker);
            });

            self.locations.push(ModelLocationData);
        }

        self.searchSubmit = function()
        {
            self.searchWords().forEach(function(word)
            {
                self.locations().forEach(function(location)
                {
                    var name = location.name.toLowerCase();
                    var address = location.address.toLowerCase();

                    if ((name.indexOf(word) === -1) && (address.indexOf(word) === -1))
                    {
                        location.visible(false);
                        location.marker.setMap(null);
                    }
                    else
                    {
                        location.visible(true);
                        location.marker.setMap(self.map);
                    }
                });
            });
        };


        self.init();
    }

    return AppViewModel;
});
