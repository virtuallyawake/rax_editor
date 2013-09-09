
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

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
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
 * Fork RAX process as a terminal. 
 */

var buff = []
  , socket
  , term;

term = pty.fork('rax', [], {});

term.on('data', function(data) {
  return !socket
    ? buff.push(data)
    : io.sockets.emit('data', data); // used to be socket.emit
});

con:qsole.log(''
  + 'Created shell with pty master/slave'
  + ' pair (master: %d, pid: %d)',
  term.fd, term.pid);

/**
* Sockets
*/

io = io.listen(server);

io.sockets.on('connection', function(sock) {
  socket = sock;

  socket.on('data', function(data) {
    console.log(data);
    term.write(data);
  });

  socket.on('disconnect', function() {
    socket = null;
  });
  
  while (buff.length) {
    //console.log('connection: ' + buff.shift() + ' ... end');
    socket.emit('data', buff.shift());
  }
});
