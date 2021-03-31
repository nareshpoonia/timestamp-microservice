// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
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
app.get("/api/whoami", function (req, res) {
  res.json({"ipaddress" : req.connection.remoteAddress,
    "language" : req.headers["accept-language"],
"software":req.headers["user-agent"] });
  
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
