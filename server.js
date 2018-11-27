var express = require("express");
var server = express();
var path = require("path");
var PORT = 3000;
var fs = require("fs");
var mapnik = require("mapnik");
var generateImage = require('./generate_img.js');

console.log(generateImage);

server.use(express.static('icon'))

  server.get("/wms", function(request, response) {
    var params = request.query;
    console.log(params);

    if(params.SERVICE === 'WMS' && params.REQUEST === 'GetCapabilities') {
     response.sendFile(path.join(__dirname , 'getCapab.xml'))
    } else if(params.SERVICE === 'WMS' && params.REQUEST === 'GetMap') {
      generateImage(params, response.sendFile.bind(response))
    } else {
      response.send('Nepodporovaná metóda.')
    }
  });



server.listen(PORT, function() {
    console.log("Server listening on port " + PORT + "!");
  });




  