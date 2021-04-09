// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var mongo = require('mongodb');
var mongoose = require('mongoose');
var shortid = require('shortid');

mongoose.connect(process.env.DB_URI);
//mongoose.connect(
//database_uri, {
  //useNewUrlParser: true, 
  //useUnifiedTopology:true 
//});

// Basic Configuration
const port = process.env.PORT || 3000;

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
var bodyParser = require('body-parser');
const { response } = require('express');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/requestHeaderParser", function (req, res) {
  res.sendFile(__dirname + '/views/requestHeaderParser.html');
});

app.get("/urlShortner", function (req, res) {
  res.sendFile(__dirname + '/views/urlShortner.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  console.log({greeting: 'hello API'});
  res.json({greeting: 'hello API'});
  
});

app.get("/api/timestamp", function (req, res) {
  var todaysDate = new Date()
  res.json({ "unix" : todaysDate.getTime(),
  "utc": todaysDate.toUTCString()  
  });
});

//timestamp project
app.get("/api/timestamp/:date_string", function (req, res) {
  let dateString= req.params.date_string;
  if (parseInt(dateString)>10000){
    let unixTime = new Date(parseInt(dateString))
    res.json({ "unix" : unixTime.getTime(),
  "utc": unixTime.toUTCString()  
  });
  }
  let datePassed = new Date(dateString);
  
  if (datePassed=="Invalid Date"){
  res.json({
     error : "Invalid Date" })}
     else {res.json({
       "unix" : datePassed.getTime(),
       "utc" : datePassed.toUTCString() 
     })}
     ;
});

//request header parser
app.get("/api/whoami", function (req, res) {
  res.json({"ipaddress" : req.connection.remoteAddress,
    "language" : req.headers["accept-language"],
"software":req.headers["user-agent"] });
  
});

//URL Shortner
//Built a schema and model to store saved URLS
var ShortURL = mongoose.model('ShortURL', new mongoose.Schema({
short_url : String,
original_url: String,
suffix: String
}));



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}))

// parse application/json
app.use(bodyParser.json())

app.post("/api/shorturl/new", function (req, res) {
  let client_requested_url =req.body.url
  let suffix= shortid.generate()
  let newShortURL= suffix
  console.log(client_requested_url,"<= this will be our original url")
  console.log(suffix,"<= this will be our suffix")

  let newURL = new ShortURL({
    short_url: __dirname + "/api/shorturl/"+suffix,
    original_url: client_requested_url,
    suffix: suffix
  })

  
  newURL.save(function(err,doc){
    if(err) return console.error(err);
    res.json({
      "saved": true,
      "short-url" : newURL.short_url,
      "original-url": newURL.original_url,
      "suffix":newURL.suffix
    });
  });



});
app.get("/api/shorturl/:suffix", (req, res) => {
  let userGeneratedSuffix = req.params.suffix;
  ShortURL.find({suffix: userGeneratedSuffix}).then(foundUrls => {
    let urlForRedirect = foundUrls[0];
    res.redirect(urlForRedirect.original_url);
  });
});
// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
