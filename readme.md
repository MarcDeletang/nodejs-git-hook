### How to use it:

To start you webhook server, use:

node app.js -c config_sample.json

### How it works:

The server will try to parse the configuration file and listen to the urls you specified (only HTTP POST request works for now). Whenever the server gets a message that match your criteria, it will execute the method you defined for it.
See some configurations below

###Configuration file:
Listen to push event on github for the branch master:

```javascript
{
	//Enable verbose module
	"verbose" : true,
    //Port you want to listen to
	"port" : 1340,
    //Declare variables you want to use later
	"vars" : [
    //It can be a string
	{ "p" : "push" },
	{ "d" : "/home/ubuntu/your-repo" },
	{ "url" : "/github-hook" },
	{ "g" : "gitlab" },
    //Or an array of command
	{ "cmd1" : [ "echo cmd11", "sleep 2", "echo cmd12" ] },
	{ "cmd2" : [ "echo cmd21",  "sleep 2 && echo cmd22" ] }
	],
    //If you want the server to listen to specific URLS
	"urls" : [
	{ "/git-hook" : [ "test2" ] },
	{ "{url}" : [ "test" ] }
	],
	"methods" : [
	{
		"type" : "{p}",
		"branch" : "master",
		"repository" : "github",
		"name" : "test2",
		"actions": [
		{
			"directory" : "{d}",
			"commands" : [ "echo github OK !" ]
		}]
	}
	]
}
```
