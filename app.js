var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();
MongoClient = require('mongodb').MongoClient;
var cons = require('consolidate');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret:"123456"}));
app.use(app.router);
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//Route Handline

MongoClient.connect('mongodb://localhost:27017/Vicinity', function(err, db) {
	
	if (err) {throw err;}		

	routes(app,db);
	
	http.createServer(app).listen(app.get('port'), function(){
  		console.log('Express server listening on port ' + app.get('port'));
	});

});

