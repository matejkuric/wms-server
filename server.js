//načítanie balíkov z adresára node modules, ktoré je potrebné nainštalovať
var express = require("express");  //import balíka na vytvorenie http servera
var path = require("path");  //import balíka pre prácu s cestami (relatívnymi a asbolútnymi)


var server = express(); //vytvorenie novej inštancie expressu v premennej ˝server˝
var PORT = 3000; //definovanie hodnoty premennej ˝PORT˝
var fs = require("fs"); // definovanie súboru File System do premennej ˝fs˝
var mapnik = require("mapnik"); //definovanie knižnice na rendovanie mapy; Mapnik je súprava nástrojov, ktorá sa používa na interpretáciu máp
var generateImage = require('./generate_img.js'); //definovanie skriptu generate_img.js do premennej ˝generateImage˝

console.log(generateImage); //vygenerovanie výstupu premennej generateImage do webovej konzoly

server.use(express.static('icon')) //definovanie statickej cesty, z ktorej sa čerpajú značky pre bodové prvky v zobrazenej mape po spustení servera

  server.get("/wms", function(request, response) { //funckia nadviazaná na cestu, http://PORT/wms (keď server dostane požiadavku)
    var params = request.query; //premenná params definuje dopyty
    console.log(params); //výpis premennej params do konzoly

    if(params.SERVICE === 'WMS' && params.REQUEST === 'GetCapabilities') {   
     response.sendFile(path.join(__dirname , 'getCapab.xml'))   //podmienka, ktorej výsledkom je súbor .xml, ktorý sa nachádza v priečinku, v ktorom sa nachádza aj tento skript
    } else if(params.SERVICE === 'WMS' && params.REQUEST === 'GetMap') {
      generateImage(params, response.sendFile.bind(response)) //podmienka, ktorej výsledkom je vygenerovaný mapový obraz
    } else {
      response.send('Nepodporovaná metóda.') //podmienka, ktorej výsledkom je text 'Nepodporovaná metóda.' ak sa dopyt nevykoná správne
    }
  });



server.listen(PORT, function() { //definovanie na ktorom PORTe sa server otvorí a čo sa vypíše do konzoly po správnom spustení servera
    console.log("Server listening on port " + PORT + "!");
  });




  