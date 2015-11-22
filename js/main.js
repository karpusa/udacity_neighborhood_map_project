//Require.js allows us to configure shortcut alias
require.config({
	paths: {
		knockout: '../node_modules/knockout/build/output/knockout-latest',
		async:'../node_modules/requirejs-plugins/src/async'
	}
});

require([
	'knockout',
	'viewmodels/app'
], function (ko, AppViewModel) {
	'use strict';

	ko.applyBindings(new AppViewModel());
});
