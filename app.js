var fs = require("fs");
var http = require('http');
var request = require('request');
var director = require('director');
var broadway = require('broadway');
var path = require('path');
var app = new broadway.App();

//The holding directory for all the applications
var dir = "./apps";
var router = new director.http.Router();
fs.readFile('./home.html', function (err, data) {
    if (err) {
        throw err;
    }
    home = data;
    console.log(home);
});

function getindex(route)
{   
    this.res.writeHead(200, { 'Content-Type': 'text/html' })
    this.res.end(output);
}

function getstatic(route)
{
    console.log(this.req.url);
	var url = this.req.url;
	var filePath = "";
	if(url == '/')
		filePath = './index.html';
	else
		filePath = '.' + this.req.url;
    
	var response = this.res;
    path.exists(filePath, function(exists) {
     
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
					response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });
}

function loadapps()
{
    fs.readdir(dir, function (err, list) {
        // Return the error if sometvar request = require('request');hing went wrong
        if (err)
          return action(err);
        
        // For every file in the list
        list.forEach(function (file) {
          var path = dir + "/" + file;
          fs.stat(path, function (err, stat) {
            console.log(file);
            // If the file is a directory
            if (stat && stat.isDirectory()) {
              console.log("using:" + path);
              app.use(require(path + '/app'));
              //Read Package
              var config = require(path + '/package');
              router.get("/" + config.name, function () {
                var resp = this.res;
                  console.log('Requesting : http://localhost:' + config.port + '/' + config.name);
                  request.get('http://localhost:' + config.port + '/' + config.name).pipe(resp);
              });
              //output = output.replace('<div id="menu">', '<div id="menu">' + menu)
              app.init(function (err){
                if(err){
                    console.log(err);
                }
              });
            }
          });
        });
    });
}

function getmenus()
{
  //Iterate through the folders and get the names and titles of the menus and return as json
}

router.get('/', getstatic );
router.get('/index.html', getstatic);
router.get('/getmenus', getmenus);
router.get('/home.html', getstatic);
router.get('/style.css', getstatic);
router.get('/plates.js', getstatic);
loadapps();



var server = http.createServer(function (req, res) {
    router.dispatch(req, res, function (err) {
      if (err) {
        res.writeHead(404);
        res.end();
      }
    });
  });
 server.listen(8080); 