'use strict';

var fs = require('fs');
var JSONLint = require('json-lint');
var _ = require('lodash');

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

	var parseUrl = function(config, rawConfig){
		if (typeof rawConfig.urls != 'undefined'){
			if (!Array.isArray(rawConfig.urls))
				config.unvalidate('"urls" field is not an array');
			else
				config.setUrlObjects(rawConfig.urls);
		}
		else
			config.unvalidate('"urls" field not found');
		return config;
	};

	var loadVars = function(rawConfig){
		var tmp = _.cloneDeep(rawConfig);
		if (typeof rawConfig.vars == 'undefined')
			return rawConfig;
		delete tmp.vars;
		tmp = JSON.stringify(tmp);

		for (var i = 0; i != rawConfig.vars.length; ++i){
			var variable = rawConfig.vars[i];
			for (var variableName in variable){
				var variableValue = variable[variableName];
				console.log(variableValue);

				if (Array.isArray(variableValue) || typeof variableValue == 'Object'){
					variableName = _.escapeRegExp(variableName);
					var tmp2 = JSON.stringify(variableValue);
					var reg = new RegExp('"\\{' + variableName + '\\}"', 'g');
					console.log(reg);


					tmp = tmp.replace(reg, tmp2);
				}
				else{
					variableName = _.escapeRegExp(variableName);
					var reg = new RegExp('\\{' + variableName + '\\}', 'g');
					console.log('solo', reg);

					tmp = tmp.replace(reg, variableValue);
				}
			}
		};
		tmp = JSON.parse(tmp);
		rawConfig.urls = tmp.urls;
		rawConfig.methods = tmp.methods;
		return rawConfig;
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
				rawConfig = loadVars(rawConfig);
				config = parseMethods(config, rawConfig);
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