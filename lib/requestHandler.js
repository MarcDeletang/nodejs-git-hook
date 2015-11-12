'use strict';

var messageParser = require('./messageParser.js');
var worker = require('./worker.js');


module.exports = function(){
	var config = null;

	return {
		setConfig: function(newConfig){
			config = newConfig;
			messageParser.setConfig(newConfig);
			worker.setConfig(newConfig);
		},

		handleRequest: function(req, res){
			if (config == null)
				return console.log('Error: No config file for request handler');
			var urls = config.getUrls();

			console.log(req.headers);
			console.log('originalUrl', req.originalUrl);
			messageParser.parse(req.body, worker, req.originalUrl);
			res.setHeader('Content-Type', 'text/plain');
			res.end('Hello');
		}
	};


}();