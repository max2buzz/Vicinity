var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();
var cons = require('consolidate');
var MongoClient = require('mongodb').MongoClient;
var parted = require('parted');


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

app.use(express.session({
    secret: Math.random().toString()
}));


var uplpath = path.join(__dirname, 'uploads');


app.use(parted({
  // custom file path
  path: "./uploads",
  // memory usage limit per request
  limit: 30 * 1024,
  // disk usage limit per request
  diskLimit: 30 * 1024 * 1024,
  // enable streaming for json/qs
  stream: true
}));


app.use(app.router);
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


//Connection Strings
var connectionStrLocal = 'mongodb://localhost:27017/Vicinity';

var connectionMongoLab = 'mongodb://Shreyas1:monday@ds033699.mongolab.com:33699/myapplication';



//Route Handline

MongoClient.connect(connectionMongoLab, function(err, db) {

    if (err) {
        console.log("DB CANT CONNECT");
        throw err;
    }
    
    console.log("DB CONNECTED!!");
    console.log(uplpath);
    routes(app, db);

    http.createServer(app).listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
    });

});