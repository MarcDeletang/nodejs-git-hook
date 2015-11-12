'use strict';

var fs = require('fs');
var JSONLint = require('json-lint');

module.exports = function() {

	var parseFile = function (content){
		var res = JSONLint(content);

		if (typeof res.error != 'undefined')
			throw res;
		res = JSON.parse(content);
		return res;
	};

	var parseMethods = function(config, rawConfig){
		if (typeof rawConfig.methods != 'undefined'){
			if (!Array.isArray(rawConfig.methods))
				config.unvalidate('"methods" field is not an array');
			else
				config.setMethods(rawConfig.methods);
		}
		else
			config.unvalidate('"methods" field not found');
		return config;
	};

	var exploreAndChange = function(methods, key, val){
		for (var i = 0; i != methods.length; ++i){
			var method = methods[i];

			for (var field in method){
				if (!Array.isArray(method[field])){
					if (field == key)
						field = val;
					if (method[field] == key)
						method[field] = val;
				}
				else {
					if (field != 'actions' && field != 'fieldsToFind')
						console.log('Weird field format:', field);
					for (var j = 0; j != method[field].length; ++j){
						var newElem = method[field][j];
						for (var fieldElem in newElem){
							if (fieldElem == key)
								fieldElem = val;
							if (newElem[fieldElem] == key){
								newElem[fieldElem] = val;
							}
						}
					}
				}
			}
		}
		return methods;
	};

	var parseVars = function(config, rawConfig){
		if (typeof rawConfig.vars == 'undefined')
			return config;
		if (!Array.isArray(rawConfig.vars)){
			config.unvalidate('"vars" field is not an array');
			return config;
		}
		for (var i = 0; i != rawConfig.vars.length; ++i){
			for (var key in rawConfig.vars[i]){
				config.setMethods(exploreAndChange(config.getMethods(), key, rawConfig.vars[i][key]));
			}
		}
		return config;
	};

	var editUrl = function(urlObj, key, val){
		for (var url in urlObj){
			var methodNames = urlObj[url];
			for (var i = 0; i != methodNames.length; ++i){
				if (methodNames[i] == key)
					methodNames[i] = val;
			}
			if (url == key){
				urlObj[val] = urlObj[url];
				delete urlObj[url];
			}
		}
		return urlObj;
	};

	var parseUrl = function(config, rawConfig){
		if (typeof rawConfig.urls == 'undefined')
			return config;
		if (!Array.isArray(rawConfig.vars)){
			config.unvalidate('"urls" field is not an array');
			return config;
		}
		for (var i = 0; i != rawConfig.vars.length; ++i){
			for (var key in rawConfig.vars[i]){
				for (var j = 0; j != rawConfig.urls.length; ++j){
					rawConfig.urls[j] = editUrl(rawConfig.urls[j], key, rawConfig.vars[i][key]);
				}
			}
		}
		config.setUrlObjecs(rawConfig.urls);
		return config;
	};

	return {

		getConfigFile: function (filePath, config){
			try{
				var fileContent = fs.readFileSync(filePath, 'utf-8');
				var rawConfig = parseFile(fileContent);
				if (typeof rawConfig.verbose != 'undefined')
					config.setVerbose(rawConfig.verbose);
				if (typeof rawConfig.port != 'undefined')
					config.setPort(rawConfig.port);
				config = parseMethods(config, rawConfig);
				config = parseVars(config, rawConfig);
				config = parseUrl(config, rawConfig);
				return config;
			}
			catch (e){
				if (e){
					console.log('Could not read configuration file');
					if (typeof e.evidence != 'undefined')
						config.unvalidate(e.evidence);
					if (typeof e.error != 'undefined'){
						config.unvalidate(e.error);
						return config;
					}
					config.unvalidate(e);
					return config;
				}
			}
		}
	};
}();