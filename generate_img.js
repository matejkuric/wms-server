var path = require("path"); //načítanie balíka pre prácu s cestami
var fs = require("fs"); // načítanie balíka node file system
var mapnik = require("mapnik"); //knižnica na rendovanie mapy; Mapnik je súprava nástrojov, ktorá sa používa na interpretáciu máp

mapnik.register_default_fonts(); //registrovanie základných fontov do mapniku
mapnik.register_default_input_plugins(); //registrovanie základných pluginov do mapniku

function generateImage(arg, sendFile){  //zadefinovanie funckie, ktorou sa vygeneruje mapový obraz
var width = Number(arg.WIDTH);  //definovanie šírky mapového obrazu v pix
var height = Number(arg.HEIGHT);  //definovanie výšky mapového obrazu v pix
var BBOX = arg.BBOX.split(',').map(function(elem){
    return Number(elem)}); //boombox - definovanie súradnicových rozmerov mapového obrazu; dolný ľavý roh a horný pravý roh
var layers = (arg.LAYERS).split(',');  //zadefinovanie čiarky ako rozdelenie popisu vrstiev (napr. budovy, cesty,...)
var map = new mapnik.Map(width, height); //definovanie premennej, ktorá bude obsahovať nové objekty mapového obrazu s definovanou šírkou a výškou

//definovanie premenných, ktoré obsahujú vrstvy (vrstva sa premennej priradí podľa textu)
var addBudovy = arg.LAYERS.includes('budovy');
var addCesty = arg.LAYERS.includes('cesty');
var addLavicky = arg.LAYERS.includes('lavicky');
var addCintorin = arg.LAYERS.includes('cintorin');
var addOdpad = arg.LAYERS.includes('odpad');
var addParkovisko = arg.LAYERS.includes('parkovisko');
var addChodniky = arg.LAYERS.includes('chodniky');
var addSkola = arg.LAYERS.includes('skola');
var addZastavky = arg.LAYERS.includes('zastavky');

//definovanie premennej, ktorá definuje projekciu, resp. súradnicový systém
var proj = "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs";

//zadefinovanie štylov jednotlivých vrstiev
var style_budovy='<Style name="style_budovy">' +   //definovanie premennej, ktorá bude obsahovať štýlovacie parametre a názov určitého štýlu
'<Rule>' +  //tagy, do ktorých budű zapísané štýlovacie parametre vrstvy
    '<LineSymbolizer stroke="#000000" stroke-width="2" />' +  //definovanie štýlu línii 
    '<PolygonSymbolizer fill="#666666"  />' +   //definovanie štýlu polygonov
'</Rule>' +
'</Style>' 

var style_cesty='<Style name="style_cesty">' + 
'<Rule>' +
    '<LineSymbolizer offset="7" stroke="#333333" stroke-width="3" />' + //definovanie štýlu línii 
    '<LineSymbolizer offset="-7" stroke="#333333" stroke-width="3" />' + 
    '<LineSymbolizer stroke="#ff9900" stroke-width="11" />' + 
    '<MinScaleDenominator>1</MinScaleDenominator>' +  //minimálna mierka, v ktorej určitý štýl bude zobrazený
    '<MaxScaleDenominator>300</MaxScaleDenominator>' + //maximálna mierka, v ktorej určitý štýl bude zobrazený
'</Rule>' +
'<Rule>' +
    '<LineSymbolizer offset="5" stroke="#333333" stroke-width="2.8" />' + 
    '<LineSymbolizer offset="-5" stroke="#333333" stroke-width="2.8" />' +
    '<LineSymbolizer stroke="#ff9900" stroke-width="7.2" />' + 
    '<MinScaleDenominator>301</MinScaleDenominator>' +
    '<MaxScaleDenominator>900</MaxScaleDenominator>' +
'</Rule>' +
'<Rule>' +
    '<LineSymbolizer offset="4" stroke="#333333" stroke-width="2.4" />' + 
    '<LineSymbolizer offset="-4" stroke="#333333" stroke-width="2.4" />' + 
    '<LineSymbolizer stroke="#ff9900" stroke-width="5.6" />' + 
    '<MinScaleDenominator>901</MinScaleDenominator>' +
    '<MaxScaleDenominator>1600</MaxScaleDenominator>' +
'</Rule>' +
'<Rule>' +
    '<LineSymbolizer offset="2" stroke="#333333" stroke-width="2" />' + 
    '<LineSymbolizer offset="-2" stroke="#333333" stroke-width="2" />' + 
    '<LineSymbolizer stroke="#ff9900" stroke-width="2" />' + 
    '<MinScaleDenominator>1601</MinScaleDenominator>' +
    '<MaxScaleDenominator>4000</MaxScaleDenominator>' +
'</Rule>' +
'<Rule>' +
    '<LineSymbolizer stroke="#ff9900" stroke-width="1.5" />' +  
    '<MinScaleDenominator>4001</MinScaleDenominator>' +
'</Rule>' +
'</Style>' 

var style_lavicky='<Style name="style_lavicky">' + 
'<Rule>' +
    '<MinScaleDenominator>1</MinScaleDenominator>' +
    '<MaxScaleDenominator>1500</MaxScaleDenominator>' +
    '<PointSymbolizer file= "./png_symbols/bench2.png" transform="scale(0.04,0.04)"/>' +   //definovanie symbolu, ktorým sa budú zobrazovať bodové prvky (v tomto prípade bol načítaný obrázok)
    "<Filter> [STAV] = 'Nepoškodená' </Filter>" +  //výber objektov podľa hodnoty určitého atribútu
    '</Rule>' +
'<Rule>' +
    '<MinScaleDenominator>1501</MinScaleDenominator>' +
    '<MaxScaleDenominator>3000</MaxScaleDenominator>' +
    '<PointSymbolizer file= "./png_symbols/bench2.png" transform="scale(0.02,0.02)"/>' + 
    "<Filter> [STAV] = 'Nepoškodená' </Filter>" +
    '</Rule>' +
'</Style>' 

var style_cintorin='<Style name="style_cintorin">' + 
'<Rule>' +
    '<LineSymbolizer stroke="#000000" stroke-width="1.3" />' + 
    '<PolygonSymbolizer fill="#cc33ff" />' + 
'</Rule>' +
'</Style>'

var style_odpad='<Style name="style_odpad">' + 
'<Rule>' +
    '<MinScaleDenominator>1</MinScaleDenominator>' +
    '<MaxScaleDenominator>1500</MaxScaleDenominator>' +
    '<PointSymbolizer file= "./png_symbols/bin.png" transform="scale(0.03,0.03)" />' + 
'</Rule>' +
'<Rule>' +
    '<MinScaleDenominator>1501</MinScaleDenominator>' +
    '<MaxScaleDenominator>3000</MaxScaleDenominator>' +
    '<PointSymbolizer file= "./png_symbols/bin.png" transform="scale(0.02,0.02)" />' + 
'</Rule>' +
'</Style>' 

var style_parkovisko='<Style name="style_parkovisko">' + 
'<Rule>' +
    '<LineSymbolizer stroke="#000000" stroke-width="1.3" />' + 
    '<PolygonSymbolizer fill="#b5d0d0"  />' + 
'</Rule>' +
'<Rule>' +
    '<PolygonPatternSymbolizer file= "./png_symbols/parking4.png"/>' +   //definovanie vzoru, ktorý sa bude nachádzať v plošných prvkov
    '<MinScaleDenominator>1</MinScaleDenominator>' +
    '<MaxScaleDenominator>290</MaxScaleDenominator>' +
'</Rule>' +
'<Rule>' +
    '<PolygonPatternSymbolizer file= "./png_symbols/parking.png"/>' +
    '<MinScaleDenominator>291</MinScaleDenominator>' +
    '<MaxScaleDenominator>1000</MaxScaleDenominator>' +
'</Rule>' +
'<Rule>' +
    '<PolygonPatternSymbolizer file= "./png_symbols/parking2.png"/>' +
    '<MinScaleDenominator>1001</MinScaleDenominator>' +
    '<MaxScaleDenominator>2000</MaxScaleDenominator>' +
'</Rule>' +
'<Rule>' +
    '<PolygonPatternSymbolizer file= "./png_symbols/parking3.png"/>' +
    '<MinScaleDenominator>2001</MinScaleDenominator>' +
'</Rule>' +
'</Style>' 

var style_chodniky='<Style name="style_chodniky">' + 
'<Rule>' +
    '<LineSymbolizer stroke="#ec2f5e" stroke-width="6" stroke-dasharray="6,2" />' + 
    '<MinScaleDenominator>1</MinScaleDenominator>' +
    '<MaxScaleDenominator>300</MaxScaleDenominator>' +
'</Rule>' +
'<Rule>' +
    '<LineSymbolizer stroke="#ec2f5e" stroke-width="5" stroke-dasharray="6,2" />' + 
    '<MinScaleDenominator>301</MinScaleDenominator>' +
    '<MaxScaleDenominator>900</MaxScaleDenominator>' +
'</Rule>' +
'<Rule>' +
    '<LineSymbolizer stroke="#ec2f5e" stroke-width="4" stroke-dasharray="6,2" />' + 
    '<MinScaleDenominator>901</MinScaleDenominator>' +
    '<MaxScaleDenominator>1600</MaxScaleDenominator>' +
'</Rule>' +
'<Rule>' +
    '<LineSymbolizer stroke="#ec2f5e" stroke-width="2.5" stroke-dasharray="6,2" />' + 
    '<MinScaleDenominator>1601</MinScaleDenominator>' +
    '<MaxScaleDenominator>4000</MaxScaleDenominator>' +
'</Rule>' +
'<Rule>' +
    '<LineSymbolizer stroke="#ec2f5e" stroke-width="1.5" stroke-dasharray="6,2" />' +  
    '<MinScaleDenominator>4001</MinScaleDenominator>' +
'</Rule>' +
'</Style>' 

var style_skola='<Style name="style_skola">' + 
'<Rule>' +
    '<MinScaleDenominator>1</MinScaleDenominator>' +
    '<MaxScaleDenominator>1500</MaxScaleDenominator>' +
    '<PointSymbolizer file= "./png_symbols/school.png" transform="scale(0.05,0.05)" />' + 
'</Rule>' +
'<Rule>' +
    '<MinScaleDenominator>1501</MinScaleDenominator>' +
    '<MaxScaleDenominator>3000</MaxScaleDenominator>' +
    '<PointSymbolizer file= "./png_symbols/school.png" transform="scale(0.03,0.03)" />' + 
'</Rule>' +
'<Rule>' +
    '<MinScaleDenominator>3001</MinScaleDenominator>' +
    '<MaxScaleDenominator>6000</MaxScaleDenominator>' +
    '<PointSymbolizer file= "./png_symbols/school.png" transform="scale(0.02,0.02)" />' + 
'</Rule>' +
'</Style>' 

var style_zastavky='<Style name="style_zastavky">' + 
'<Rule>' +
    '<MinScaleDenominator>1</MinScaleDenominator>' +
    '<MaxScaleDenominator>500</MaxScaleDenominator>' +
    '<PointSymbolizer file= "./png_symbols/bus.png" transform="scale(0.07,0.07)" />' + 
'</Rule>' +
'<Rule>' +
    '<MinScaleDenominator>501</MinScaleDenominator>' +
    '<MaxScaleDenominator>1500</MaxScaleDenominator>' +
    '<PointSymbolizer file= "./png_symbols/bus.png" transform="scale(0.05,0.05)" />' + 
'</Rule>' +
'<Rule>' +
    '<MinScaleDenominator>1501</MinScaleDenominator>' +
    '<MaxScaleDenominator>5000</MaxScaleDenominator>' +
    '<PointSymbolizer file= "./png_symbols/bus.png" transform="scale(0.03,0.03)" />' + 
'</Rule>' +
'</Style>' 

//definovanie schemy mapnik XML v premennej
var schema = '<Map background-color="transparent" srs="'+proj+'">' +  //definovanie farby (alebo nejakého motívu) pre pozadie mapy a projekcie mapy
                (addBudovy ? style_budovy : '') + //ternárny operátor - ak je splnená podmienka, t.j. ak ne add_____ definovaná, 
                                                  //tak sa vráti príslušný štýl, ak nie je, nič sa nevykoná
                (addCesty ? style_cesty : '') +
                (addCintorin ? style_cintorin : '') +           
                (addLavicky ? style_lavicky : '') +
                (addOdpad ? style_odpad : '') +
                (addParkovisko ? style_parkovisko : '') +
                (addChodniky ? style_chodniky : '') +
                (addSkola ? style_skola : '') +
                (addZastavky ? style_zastavky : '') +

               
                '<Layer name="chodniky" srs="'+proj+'">' +    //definovanie projekcie určitej vrstve
                    '<StyleName>style_chodniky</StyleName>' +  //pridelenie príslušného štýlu
                    '<Datasource>' +  //definovanie zdroju dát
                        '<Parameter name="file">' + path.join( __dirname, 'data/chodniky.shp' ) +'</Parameter>' + //cesta k vrstve
                        '<Parameter name="type">shape</Parameter>' + //definovanie typu vrstvy
                    '</Datasource>' +
                '</Layer>' +                
                '<Layer name="cesty" srs="'+proj+'">' +
                    '<StyleName>style_cesty</StyleName>' +
                    '<Datasource>' +
                        '<Parameter name="file">' + path.join( __dirname, 'data/cesty.shp' ) +'</Parameter>' +
                        '<Parameter name="type">shape</Parameter>' +
                    '</Datasource>' +
                '</Layer>' +
                '<Layer name="parkovisko" srs="'+proj+'">' +
                    '<StyleName>style_parkovisko</StyleName>' +
                    '<Datasource>' +
                        '<Parameter name="file">' + path.join( __dirname, 'data/parkovisko.shp' ) +'</Parameter>' +
                           '<Parameter name="type">shape</Parameter>' +
                    '</Datasource>' +
                '</Layer>' +
                '<Layer name="budovy" srs="'+proj+'">' +
                '<StyleName>style_budovy</StyleName>' +
                '<Datasource>' +
                    '<Parameter name="file">' + path.join( __dirname, 'data/budovy.shp' ) +'</Parameter>' +
                       '<Parameter name="type">shape</Parameter>' +
                '</Datasource>' +
            '</Layer>' +
            '<Layer name="cintorin" srs="'+proj+'">' +
                    '<StyleName>style_cintorin</StyleName>' +
                    '<Datasource>' +
                        '<Parameter name="file">' + path.join( __dirname, 'data/cintorin.shp' ) +'</Parameter>' +
                           '<Parameter name="type">shape</Parameter>' +
                    '</Datasource>' +
                '</Layer>' +    
                '<Layer name="skola" srs="'+proj+'">' +
                '<StyleName>style_skola</StyleName>' +
                '<Datasource>' +
                    '<Parameter name="file">' + path.join( __dirname, 'data/skola.shp' ) +'</Parameter>' +
                       '<Parameter name="type">shape</Parameter>' +
                '</Datasource>' +
            '</Layer>' +
            '<Layer name="zastavky" srs="'+proj+'">' +
                '<StyleName>style_zastavky</StyleName>' +
                '<Datasource>' +
                    '<Parameter name="file">' + path.join( __dirname, 'data/zastavky.shp' ) +'</Parameter>' +
                       '<Parameter name="type">shape</Parameter>' +
                '</Datasource>' +
            '</Layer>' +
                '<Layer name="odpad" srs="'+proj+'">' +
                '<StyleName>style_odpad</StyleName>' +
                '<Datasource>' +
                    '<Parameter name="file">' + path.join( __dirname, 'data/odpad.shp' ) +'</Parameter>' +
                       '<Parameter name="type">shape</Parameter>' +
                '</Datasource>' +
            '</Layer>' +
                '<Layer name="lavicky" srs="'+proj+'">' +
                '<StyleName>style_lavicky</StyleName>' +
                '<Datasource>' +
                    '<Parameter name="file">' + path.join( __dirname, 'data/lavicky.shp' ) +'</Parameter>' +
                       '<Parameter name="type">shape</Parameter>' +
                '</Datasource>' +
            '</Layer>' +
                '</Map>';





map.fromString(schema, function(err, map) { //použitie funkccie from String, ktorou načítame XML schemu
  if (err) {
      console.log('Error: ' + err.message) //výpis chyby (ak nejaká nastala)
  }

  map.zoomToBox(BBOX); //približenie mapy na definovaný boombox (BBox)

  var im = new mapnik.Image(width, height); //definovanie nového mapnik mapového obrázku s rovnakou šírkou a výškou

  map.render(im, function(err, im) {  //vygenerovanie mapového obrázku z premennej im
      
    if (err) {
        console.log('Error: ' + err.message) //výpis chyby (ak nejaká nastala)
    }

    im.encode("png", function(err, buffer) {  //zakóduje naš mapový obraz do formátu .png
      if (err) {
         console.log('Error: ' + err.message)  //výpis chyby (ak nejaká nastala)
      }

      fs.writeFile(  //použíjeme node file system súbor ''fs'' na uloženie súboru do určitej súborovej cesty
        path.join(__dirname, "out/map.png"), //kombinácia adresára, v ktorom sa nachádza skript s adresou, do ktorej chceme uložiť obrázok mapy
        buffer, //vloží obrazový buffer vytvorený metódou im.encode mapnika
        function(err) {
          if (err) {
              console.log('Error: ' + err.message)  //výpis chyby (ak nejaká nastala)
          }
          console.log('Image generated into: ' + 
            path.join(__dirname, "out/map.png") //vypíše adresu, do ktorej sa uložil mapový obrázok
            );
            sendFile(path.join(__dirname ,"out/map.png")); //cesta k vygenerovanému mapovému obrázku
        }
        );
      });
    });
  })
  };
  
  module.exports = generateImage; //definovanie modula, ktorý bude importovaný do skriptu servera