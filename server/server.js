
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


 var options = {
   key: fs.readFileSync('server/ssl/pauls-ssl-key.pem'),
   cert: fs.readFileSync('server/ssl/pauls-ssl-cert.pem'),
   
 };

// var options = {
//   key: fs.readFileSync('server/secret/private.key'),
//   cert: fs.readFileSync('server/secret/self.crt')
// };

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

var server = http.createServer(function (request, response) {
  console.log(request);
  console.log(request.headers.host);

  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello World\n");
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
// console.log("Server running at http://127.0.0.1:8000/  Hello World");
// console.log("Server running at https://127.0.0.1:8080/");

console.log("Server running at http: 8000  Hello World");
console.log("Server running at https: :8080");



//https.createServer(function(req, res) {
https.createServer(options, function (req, res) {
    
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
}).listen(8080);

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


// https.createServer(options, function (req, res) {
//   res.writeHead(200);
//   res.end("hello world\n");
// }).listen(8000);