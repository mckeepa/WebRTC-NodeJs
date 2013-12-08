var http  = require("http"), 
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

http.createServer(function(req, res) {
    
    var path_Html_Public = path.join("..","FullScreenMario");
    
   
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
      res.writeHead(200, {
        "Content-Type": mimeType,
        "Content-Length": contents.length
      });
      res.end(contents);
    } else {
      res.writeHead(500);
      res.end();
    }
  });

}