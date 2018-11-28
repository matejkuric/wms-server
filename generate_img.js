var path = require("path");
var fs = require("fs");
var mapnik = require("mapnik");

mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

function generateImage(arg, sendFile){
var width = Number(arg.WIDTH);
var height = Number(arg.HEIGHT);
var BBOX = arg.BBOX.split(',').map(function(elem){
    return Number(elem)});
var layers = (arg.LAYERS).split(',');
var map = new mapnik.Map(width, height);

var addBudovy = arg.LAYERS.includes('budovy');
var addCesty = arg.LAYERS.includes('cesty');
var addLavicky = arg.LAYERS.includes('lavicky');
var addCintorin = arg.LAYERS.includes('cintorin');
var addOdpad = arg.LAYERS.includes('odpad');
var addParkovisko = arg.LAYERS.includes('parkovisko');

var proj = "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs";

var style_budovy='<Style name="style_budovy">' + 
'<Rule>' +
    '<LineSymbolizer stroke="#000000" stroke-width="2" />' + 
    '<PolygonSymbolizer fill="#666666"  />' + 
'</Rule>' +
'</Style>' 

var style_cesty='<Style name="style_cesty">' + 
'<Rule>' +
    '<LineSymbolizer offset="7" stroke="#333333" stroke-width="3" />' + 
    '<LineSymbolizer offset="-7" stroke="#333333" stroke-width="3" />' + 
    '<LineSymbolizer stroke="#ff9900" stroke-width="11" />' + 
    '<MinScaleDenominator>1</MinScaleDenominator>' +
    '<MaxScaleDenominator>300</MaxScaleDenominator>' +
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
    '<PointSymbolizer file= "./png_symbols/bench2.png" transform="scale(0.04,0.04)" />' + 
'</Rule>' +
'<Rule>' +
    '<MinScaleDenominator>1501</MinScaleDenominator>' +
    '<MaxScaleDenominator>3000</MaxScaleDenominator>' +
    '<PointSymbolizer file= "./png_symbols/bench2.png" transform="scale(0.02,0.02)" />' + 
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
    '<PolygonPatternSymbolizer file= "./png_symbols/parking4.png"/>' +
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

var schema = '<Map background-color="transparent" srs="'+proj+'">' +
                (addBudovy ? style_budovy : '') +
                (addCesty ? style_cesty : '') +
                (addCintorin ? style_cintorin : '') +           
                (addLavicky ? style_lavicky : '') +
                (addOdpad ? style_odpad : '') +
                (addParkovisko ? style_parkovisko : '') +

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





map.fromString(schema, function(err, map) {
  if (err) {
      console.log('Error: ' + err.message)
  }

  map.zoomToBox(BBOX);

  var im = new mapnik.Image(width, height);

  map.render(im, function(err, im) {
      
    if (err) {
        console.log('Error: ' + err.message)
    }

    im.encode("png", function(err, buffer) {
      if (err) {
         console.log('Error: ' + err.message)
      }

      fs.writeFile(
        path.join(__dirname, "out/map.png"),
        buffer,
        function(err) {
          if (err) {
              console.log('Error: ' + err.message)
          }
          console.log('Image generated into: ' + 
            path.join(__dirname, "out/map.png")
            );
            sendFile(path.join(__dirname ,"out/map.png"));
        }
        );
      });
    });
  })
  };
  
  module.exports = generateImage;