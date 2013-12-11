
var http  = require("http"), 
    https = require('https'),
    path = require("path"), 
    fs = require("fs"), 
    extensions = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
      ".png": "image/png",
      ".gif": "image/gif",
      ".jpg": "image/jpeg",
      ".xml":"application/xml",
      ".handlebars": "application/xml",
      ".map":"application/xml",
      ".woff":"application/x-font-woff",
      ".ogg":"audio/ogg",
      ".ico":"image/x-icon"
    };

// var caKeyFilePath = path.join('server', 'ssl', 'cakey.pem');
// var caCertFilePath = path.join('server', 'ssl', 'cacert.pem');
// console.log("key:", caKeyFilePath);
// console.log("key:....");

// console.log("Cert:", caCertFilePath);


 // var options = {
 //   key: fs.readFileSync('server/ssl/pauls-ssl-key.pem'),
 //   cert: fs.readFileSync('server/ssl/pauls-ssl-cert.pem'),
   
 // };

var options = {
  key: fs.readFileSync('server/secret/private.key'),
  cert: fs.readFileSync('server/secret/self.crt')
};

//var options = {
//    // Important: the following crt and key files are insecure
//    // replace the following files with your own keys
//    key:fs.readFileSync('server/secret/private.key'),
//    ca:[fs.readFileSync('server/secret/AddTrustExternalCARoot.crt'),
//        fs.readFileSync('server/secret/SSLcomAddTrustSSLCA.crt')],
//    cert:fs.readFileSync('server/secret/www_sharefest_me.crt')
//};


// http.createServer(options, function (req, res) {
//   //console.log(req);
//   res.writeHead(200);

//   res.redirect('https://mydomain.com'+req.url)
//   res.end("hello world\n");
// }).listen(8000);

var processRequest = function(req, res){
   var path_Html_Public = path.join("..","public");
    
   
    var filename = path.basename(req.url) || "index.html",
    dir = path.dirname(req.url).substring(1),
    ext = path.extname(filename),
    // __dirname is a built-in variable containing the path where the code is running
    localPath = path.join(__dirname , path_Html_Public);
   
    //console.log('FileName: ' + filename);
    //console.log('extname: ' + path.extname(filename));
    var newExt = path.extname(filename).split("?");
    //console.log(newExt);
    //console.log(newExt[0]);

    ext = newExt[0];


    if (extensions[ext]) {
        localPath = path.join(localPath, dir);
        //localPath = path.join(localPath, filename);
        localPath = path.join(localPath, filename.split('?')[0]);

        
        fs.exists(localPath, function(exists) {
        if (exists) {
          getFile(localPath, extensions[ext], res);
        } else {
          console.log("localPath 1:" , localPath);
          console.log("Not found");
          res.writeHead(404);
          res.end();
        } });
    } else {
       console.log("localPath 2:" , localPath);
       console.log("extension Not mapped: " + ext);
       res.writeHead(404);
        res.end();
    } 
  };

var server = http.createServer(function (req,res) {
  console.log(req);
  console.log(req.headers.host);
  processRequest(req,res);

  //response.writeHead(200, {"Content-Type": "text/plain"});
  //response.end("Hello World\n");
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);
console.log("Server running at http: 8000");

// Put a friendly message on the terminal
// console.log("Server running at http://127.0.0.1:8000/  Hello World");
// console.log("Server running at https://127.0.0.1:8080/");

//https.createServer(function(req, res) {
https.createServer(options, function (req, res) {
    processRequest(req,res);
  
}).listen(8080);

console.log("Server running at https: :8080");


function getFile(localPath, mimeType, res) {
  // read the file in and return it, or return a 500 if it can't be read
  fs.readFile(localPath, function(err, contents) {
    if (!err) {
      	res.writeHead(200, {"Content-Type": mimeType,"Content-Length": contents.length
      });
      res.end(contents);
    } else {
      res.writeHead(500);
      res.end();
    }
  });

}



<!-- Peer 2 peer -->
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket){

  // convenience function to log server messages on the client
  function log(){
    var array = [">>> Message from server: "];
    for (var i = 0; i < arguments.length; i++) {
      array.push(arguments[i]);
    }
      socket.emit('log', array);
  }


  socket.on('chat', function (message) {
    log('Got chat message:', message);
    // for a real app, would be room only (not broadcast)
    socket.broadcast.emit('chat', message);
    log('Emit chat message:', message);
 
  });

  socket.on('message', function (message) {
    log('Got message:', message);
    // for a real app, would be room only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  socket.on('create or join', function (room) {
    var numClients = io.sockets.clients(room).length;

    log('Room ' + room + ' has ' + numClients + ' client(s)');
    log('Request to create or join room ' + room);

    if (numClients === 0){
      socket.join(room);
      socket.emit('created', room);
    } else if (numClients === 1) {
      io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room);
    } else { // max two clients
      socket.emit('full', room);
    }
    socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
    socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);

  });

});
