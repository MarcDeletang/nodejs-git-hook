'use strict';

module.exports = function() {
	var config = null;

	var invalidateUrl = function(urlRequested, method){
		var urlObjs = config.getUrlObjects();
		if (urlObjs.length == 0)
			return false;
		if (typeof method.name == 'undefined')
			return false;
		for (var i = 0; i != urlObjs.length; ++i){
			var urlObj = urlObjs[i];
			for (var url in urlObj){
				var methods = urlObj[url];
				for (var j = 0; j != methods.length; ++j){
					var methodName = methods[j];

					if (url == urlRequested && methodName == method.name){
						if (config.getVerbose())
							console.log('Valid url/method: ', urlRequested, method.name);
						return false;
					}
				}
			}
		}
		if (config.getVerbose())
			console.log('Not valid url/method: ', urlRequested, method.name);
		return true;
	};

	var parseGitLabMessage = function(message, worker, urlRequested){
		if (typeof message.object_kind == 'undefined' || message.object_kind == null)
			return;
		if (message.object_kind == 'push'){
			var methods = config.getMethods();

			for (var i = 0; i != methods.length; ++i){
				var method = methods[i];
				if (invalidateUrl(urlRequested, method))
					continue;

				if (method.type == 'push' && method.repository == 'gitlab'){
					if (typeof method.branch == 'undefined'){
						console.log('You must specify a branch for push events');
						continue;
					}
					if (message.ref.indexOf(method.branch) != -1)
						worker.execMethod(method);
				}
			}
		}
	};

	var handleGitHubPush = function(message, worker, urlRequested){
		var methods = config.getMethods();

		for (var i = 0; i != methods.length; ++i){
			var method = methods[i];
			if (invalidateUrl(urlRequested, method))
				continue;

			if (method.type == 'push' && method.repository == 'github'){
				if (typeof method.branch == 'undefined'){
					console.log('You must specify a branch for push events');
					continue;
				}
				if (message.ref.indexOf(method.branch) != -1)
					worker.execMethod(method);
			}
		}
	};

	var parseGitHubMessage = function(message, worker, urlRequested){
		if (typeof message.pusher == 'undefined' || message.pusher == null)
			return;
		if (message.pusher)
			return handleGitHubPush(message, worker, urlRequested);
	};

	var parseBitBucketMessage = function(message, worker, urlRequested){
		//TODO
	};

	var parseCustomMessage = function(message, worker){
		//TODO
	};

	return {
		setConfig: function(newConfig){
			config = newConfig;
		},

		parse: function(message, worker, urlRequested){
			if (config == null)
				return console.log('Error: No config file for messageParser');
			parseGitLabMessage(message, worker, urlRequested);
			parseGitHubMessage(message, worker, urlRequested);
		}

	};

}();