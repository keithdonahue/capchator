// this captcha example uses the captchator which is ver simple
// captchator main page is here: http://captchator.com/
// captchator demo is here: http://captchator.com/test.php
// example in php which translates to node very simply is here: http://captchator.com/test.php.txt

var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var app = express();
 
var http = require('http');
 
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('html', ejs.renderFile);

app.set('view engine', 'ejs');

var sessionid = guid();
app.get('/', function(req, res) {
	res.render('index.ejs',  { data: { title: 'Logout', id: sessionid } } );
});
 
app.post('/register', function(req, res) {
    verifyRecaptcha(req.body["captcha_answer"], function(success) {
        if (success) {
        	res.end("Success!");
            // TODO: do registration using params in req.body
        } else {
	        res.end("Captcha failed, sorry.");
	        // TODO: take them back to the previous page
	        // and for the love of everyone, restore their inputs
        }
    });
});

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
 
app.listen(3001);
 
// Helper function to make API call to recatpcha and check response
function verifyRecaptcha( key, callback ) {
    http.get( "http://captchator.com/captcha/check_answer/" + sessionid + "/" + key, function( res ) {
        var data = "";
        res.on('data', function (chunk) {
        	data += chunk.toString();
        });
        res.on('end', function() {
            var didItWork = parseInt( data, 10 );
            try {
                //var parsedData = JSON.parse(data);
                callback( didItWork );
            } catch (e) {
                callback( didItWork );
            }
        });
    });
}