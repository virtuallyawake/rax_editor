
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var terminal = require('term.js');
var pty = require('pty.js');
var io = require('socket.io');
var execFile = require('child_process').execFile;

// Generate docs (views/sections.html) from the sections in views/docSections
execFile('./generateDocs.sh', // bash script that generates docs
  function (error, stdout, stderr) {  // capture data/errors
    console.log('./generateDocs.sh: stdout: ' + stdout);
    if (stderr)
       console.log('./generateDocs.sh: stderr: ' + stderr);
    if (error)
       console.log('exec error: ' + error);
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(terminal.middleware());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/**
 * Sockets
 */

io = io.listen(server);

io.sockets.on('connection', function(socket) {

  console.log("Socket id: " + socket.id);

  socket.on('data', function(data) {
    console.log(data);
    term.write(data);
  });

  socket.on('disconnect', function() {
    socket = null;
  });

  /**
   * Fork RAX process as a terminal. 
   */

   var term = pty.fork('rax', [], {});

   term.on('data', function(data) {
      return socket.emit('data', data);
   });
});
