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

var proj = "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs";

var style_budovy='<Style name="style_budovy">' + 
'<Rule>' +
    '<LineSymbolizer stroke="#110c08" stroke-width="0.2" />' + 
    '<PolygonSymbolizer fill="#ea8428"  />' + 
'</Rule>' +
'</Style>' 

var style_cesty='<Style name="style_cesty">' + 
'<Rule>' +
    '<LineSymbolizer stroke="#d7c8b9" stroke-width="0.8" />' + 
'</Rule>' +
'</Style>' 

var style_lavicky='<Style name="style_lavicky">' + 
'<Rule>' +
    '<MinScaleDenominator>1</MinScaleDenominator>' +
    '<MaxScaleDenominator>1500</MaxScaleDenominator>' +
    '<PointSymbolizer file= "d:/School/School/wms-server/png_symbols/bench_1.png" transform="scale(0.05,0.05)" />' + 
'</Rule>' +
'<Rule>' +
    '<MinScaleDenominator>1501</MinScaleDenominator>' +
    '<MaxScaleDenominator>3000</MaxScaleDenominator>' +
    '<PointSymbolizer file= "d:/School/School/wms-server/png_symbols/bench_1.png" transform="scale(0.03,0.03)" />' + 
'</Rule>' +
'</Style>' 

var style_cintorin='<Style name="style_cintorin">' + 
'<Rule>' +
    '<LineSymbolizer stroke="#110c08" stroke-width="0.3" />' + 
    '<PolygonSymbolizer fill="#aacbaf"  />' + 
'</Rule>' +
'</Style>'

var schema = '<Map background-color="transparent" srs="'+proj+'">' +
                (addBudovy ? style_budovy : '') +
                (addCesty ? style_cesty : '') +
                (addCintorin ? style_cintorin : '') +           
                (addLavicky ? style_lavicky : '') +

                '<Layer name="cesty" srs="'+proj+'">' +
                    '<StyleName>style_cesty</StyleName>' +
                    '<Datasource>' +
                        '<Parameter name="file">' + path.join( __dirname, 'data/cesty.shp' ) +'</Parameter>' +
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