var express = require(express);
var path = require("path");

var server = require("path")
var port = 3000;


var path = require("path"); //zadefinovanie cesty, napr join
var fs = require("fs"); //mame, ak mame nodejs
var mapnik = require("mapnik"); // lib for map rendering

mapnik.register_default_fonts(); // register some default fonts into mapnik
mapnik.register_default_input_plugins(); // same with plugins

var arg = {BBOX: [[-508428.4646376185119,-1222456.082299999893,-504979.520799998194,-1220887.147535035154]
           WIDTH: ]}

function getMap(reqParams) {
    var width = Number(reqParams.WIDTH);
    var height = Number(req.Params.HEIGHT);
    var BBOX = reqParams.BBOX.split(',');


    var map = new mapnik.Map(width,height);
}





//if (podmienka) {
    //return true;
    // } else {
    //    return false
    // }

    //TO JE ISTE AKO    podmienka ? true : false

//  var style_budovy =  KOD NA STYLE BUDOVY
//  var addBudovy = arg.LAYERS.includes('budovy')  ... vyhladava slovo budovy v nasej podmienke, tj vyhladavani napr url
//      POTOM addBudovy ? style_budovy : '' +

