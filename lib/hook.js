'use strict';

var app = require('express')();
var bodyParser = require('body-parser');
var config = require('./config.js');
var parser = require('./parser.js');
var handler = require('./requestHandler');

module.exports.start = function() {

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended : true }));

	var found = false;

	for (var i = 2; i < process.argv.length; ++i){
		var arg = process.argv[i];
		if (arg == '-c'){
			if (typeof process.argv[i + 1] == 'undefined')
				console.log('Please specify a configuration file');
			else{
				config = parser.getConfigFile(process.argv[i + 1], config);
				found = true;
			}
		}
	}
	if (!config.isInit()){
		var errors = config.getErrors();
		for (var i = 0; i != errors.length; ++i){
			if (typeof errors[i].lineNumber != 'undefined')
				console.log(errors[i].lineNumber);
			console.log(errors[i]);
		}
		return;
	}
	if (!found)
		return console.log('No config file');
	handler.setConfig(config);

	var urls = config.getUrls();
	if (urls.length == 0){
		app.post(config.getDefaultUrl(), handler.handleRequest);
		if (config.getVerbose())
			console.log('Listening to: ' + config.getDefaultUrl() + ' (default)');
	}else{
		for (var i = 0; i != urls.length; ++i){
			app.post(urls[i], handler.handleRequest);
			if (config.getVerbose())
				console.log('Listening to: ' + urls[i]);
		}
	}
	app.listen(config.getPort());
};