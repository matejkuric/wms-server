var express = require("express");
var server = express();
var path = require("path");
var PORT = 3000


server.get('/getCapabilities', function (request, response) {
    console.log(response.sendFile)
   response.sendFile(path.join(__dirname + '\\Capabilites.xml'))
   
})


server.get("/query-test", function(request, response) {
    console.log(request.query);
    response.send(request.query);
  });


server.listen(PORT, function() {
    console.log("Server listening on port " + PORT + "!");
  });