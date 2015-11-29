define([
    'knockout',
    'config/foursquare',
    '../../node_modules/jquery/dist/jquery.min',
], function (ko, configFoursquare) {
    'use strict';

    var Location= function(data)
    {
        var self = this;
        self.uniqnumber = 'id' + new Date().getUTCMilliseconds(),
        self.name = data.name;
        self.address = data.address;
        self.latLng = data.latLng;
        self.visible = ko.observable(true);
        self.marker = data.marker;

        self.info = ko.computed( function()
        {
            var content =
                '<h1 id="firstHeading" class="firstHeading">'+self.name+'</h1>'+
                '<div id="bodyContent">'+
                '<p>'+self.address+'</p>'+
                '<div id="addition-info-' + self.uniqnumber + '">processing</div>';

            return content;
        });

        self.getAdditionInfo = function() {
            var fsUrl = configFoursquare.url + 'venues/search?client_id=' + configFoursquare.clientId +
                '&client_secret=' + configFoursquare.clientSecret + '&v=20151129&ll='+self.latLng.lat+','+self.latLng.lng+'&limit=1',
                $id = $('#addition-info-' + self.uniqnumber);

            if (self.getAdditionInfoCache) {
                return;
            }

            $.getJSON(fsUrl, function(data){
                var venue = data.response.venues[0],
                    output = '';

                self.getAdditionInfoCache = true;

                if(venue.url){
                    output += '<p>Website: <a class="link link_black" href="' + venue.url +'" target="_blank">' + venue.url + '</a></p>';
                } else {
                    output += '<p>Website: not found</p>';
                }

                if(venue.contact.formattedPhone){
                    output += '<p>Phone: ' + venue.contact.formattedPhone + '</p>';
                } else {
                    output += '<p>Phone: not found</p>';
                }

                $id.html(output);

                return true;
            }).error(function(e){
                self.getAdditionInfoCache = true;

                $id.html('<p>Api not work</p>');

                return false;
            });
        };

    };

    return Location;
});
