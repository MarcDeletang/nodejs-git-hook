'use strict';

var exec = require('child_process').exec;

module.exports = function() {
	var config = null;

	var execCommands = function(directory, commands, cb){
		if (commands.length == 0)
			return cb();

		process.chdir(directory);
		exec(commands[0], function(error, stdout, stderr){
			console.log('stdout', stdout);
			commands.shift();
			execCommands(directory, commands, cb);
		});
	};

	var execActions = function(actions, finalCb){
		if (actions == null || actions.length == 0)
			return finalCb();
		var commandsDone = function(){
			if (config.getVerbose())
				console.log("All actions finished for directory " + actions[0].directory);
			actions.shift();
			execActions(actions, finalCb);
		};
		var action = actions[0];

		execCommands(action.directory, action.commands, commandsDone);
	};

	return {
		setConfig: function(newConfig){
			config = newConfig;
		},

		execMethod: function(method){
			if (config == null)
				return console.log('Error: No config file for worker');
			var actions = method.actions;
			var jobsDone = function(){
				if (config.getVerbose()){
					if (typeof method.name != 'undefined')
						return console.log("Jobs done for method " + method.name);
					return console.log("Jobs are done");
				}
			};
			execActions(actions, jobsDone);
		}
	};

}();