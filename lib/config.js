'use strict';

var _ = require('lodash');

module.exports = function() {
	var methods = [];
	var errors = [];
	var urlsObjs = [];
	var verbose = true;
	var init = true;
	var port = 1340;
	var defaultUrl = '/nodejs-githook';

	var addError = function(error){
		errors.push(error);
	};

	return {
		getDefaultUrl: function(){
			return defaultUrl;
		},

		setUrlObjecs: function(newUrls){
			urlsObjs = newUrls;
		},

		getUrlObjects: function(){
			return urlsObjs;
		},

		getUrls: function(){
			var res = [];
			for (var i = 0; i != urlsObjs.length; ++i){
				for (var url in urlsObjs[i])
					res.push(url);
			}
			return res;
		},

		addUrlObj: function(url){
			urlsObjs.push(url);
		},

		getMethods: function(){
			return _.cloneDeep(methods);
		},

		setMethods: function(newMethods){
			methods = newMethods;
		},

		setPort: function(newPort){
			if (verbose)
				console.log('Port set:', newPort);
			port = newPort;
		},

		getPort: function(){
			return port;
		},

		setVerbose: function(newVerbose){
			verbose = newVerbose;
		},

		getVerbose: function(){
			return verbose;
		},

		isInit: function (){
			return init;
		},

		unvalidate: function(error){
			init = false;
			addError(error);
		},

		getErrors: function(){
			return errors;
		}
	};
}();