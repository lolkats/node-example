// Clean up cache
var shutDown = false;
// Load configuration
var config = require('./config');

// GLOBALS
GLOBAL.Log = require('./lib/log')(config.log);

Log.info("Starting the node-example server.");
GLOBAL.rootDir = __dirname;

// Load required modules
Log.info("Trying to load all modules.");
var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    staticFavicon = require('static-favicon'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    config = require('./config'),
    database = require('./lib/db')(config.db),
    app = express();

// View engines
app.engine('dust', require('adaro').dust({cache:true}));
app.enable('view cache');
app.set('views', __dirname + '/views');
app.set('view engine', 'dust');
app.use(cookieParser(config.secret));
app.use(session());
app.use(express.static(path.join(__dirname, 'public')));
Log.info("Loading routes.");


var router = express.Router();
router.Router = express.Router;
fs.readdirSync(rootDir+'/routes/').forEach(function(file) {
    fs.stat(rootDir+'/routes/'+file,function(err,stat){
        if(stat.isDirectory()){
            require("./routes/"+file)(router);
        }
    });
});

app.use('/', router);
// Error Handling
app.use(function(err, req, res, next){
    Log.error(err.stack);
    res.send(500, 'Something broke!');
});

if(process.env.NODE_ENV == 'production'){
    var server = app.listen("/tmp/node-example.sock",function () {
        if (process.send) process.send('online');
    });
}
else{
    var server = app.listen(3000, function () {
        if (process.send) process.send('online');
    });
}

process.on('message', function(message) {
 if (message === 'stop') {
    server.close();
 }
});