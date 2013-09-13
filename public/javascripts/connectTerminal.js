      (function() {
      window.onload = function() {
	var socket = io.connect();
	socket.on('connect', function() {
	  var term = new Terminal({
	    cols: 80,
            rows: 24,
            useStyle: true,
	    screenKeys: true
	  });

	  term.on('data', function(data) {
	    socket.emit('data', data);
	  });
  
	  term.on('title', function(title) {
	    //document.title = title;
	  });

	  term.open(document.getElementById("terminal"));

	  socket.on('data', function(data) {
	    term.write(data);
	  });
  
	  socket.on('disconnect', function() {
	    term.destroy();
	  });
	});
    };
  }).call(this);
