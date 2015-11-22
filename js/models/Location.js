define([
    'knockout'
], function (ko) {
    'use strict';

    var Location= function(data)
    {
        var self = this;

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
                '<p>'+self.address+'</p>';
            return content;
        });

    };

    return Location;
});
