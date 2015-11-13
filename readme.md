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
    //Or an array of command
	{ "cmd" : [ "echo 'It works !'",  "git pull origin master" ] }
	],
    //If you want the server to listen to specific URLS, it will execute all the methods you defined if criteria match
	"urls" : [
	{ "{url}" : [ "githubMethod" ] }
	],
	"methods" : [
	{
		"type" : "{p}",
		"branch" : "master",
		"repository" : "github",
		"name" : "githubMethod",
		"actions": [
		{
			"directory" : "{d}",
			"commands" : "{cmd}"
		}]
	}
	]
}
```
