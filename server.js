var express = require("express");
var server = express();
var path = require("path");
var PORT = 3000


server.get('/getCapabilities', function (request, response) {
    console.log(response.sendFile)
   response.sendFile(path.join(__dirname + '\\antropogene_moje.xml'))
   
})


server.get("/query-test", function(request, response) {
    console.log(request.query);
    response.send(request.query);
  });

  server.get("/wms", function(request, response) {
    var params = request.query;
    console.log(params);

    if(params.SERVICE === 'wms' && params.REQUEST === 'GetCapabilities') {
     response.sendFile(path.join(__dirname , '.\\antropogene_moje.xml'))
    } else if(params.SERVICE === 'wms' && params.REQUEST === 'GetMap') {
      console.log('idem robit get map')
    } else {
      response.send('nepodporovana metoda')
    }
  });



server.listen(PORT, function() {
    console.log("Server listening on port " + PORT + "!");
  });