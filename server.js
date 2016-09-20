
var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('userslist', ['userslist']);
var bodyParser = require('body-parser');
// var twilio = require('twilio');
// var client = new twilio.RestClient('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');
var TMClient = require('textmagic-rest-client');
var session = require('express-session');
app.use(express.static(__dirname + '/www'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({// to support URL-encoded bodies
  extended:true}));

app.all('*',function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', "*");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//get request for mongodb
app.get('/userlist', function (req, res) {
  console.log('I received a GET request');
  db.userslist.find(function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

//post request for checking login email availability
app.post('/login',function(req,res){
 console.log(req.body.email);
    if(req.body.email!=""){
        db.userslist.find({email: req.body.email}, function (err, doc) {
          res.json(doc);
        });
     }
});

//post request for checkemail in login page
app.post('/checkemail',function(req,res){
  console.log(req.body.email);
 db.userslist.count({email:req.body.email},function(err,doc){
  res.json(doc);
});
});

//post rest for checking password in login page
app.post('/checkpwd',function(req,res){
  console.log(req.body.password);
  db.userslist.count({password:req.body.password},function(err,doc){
  res.json(doc);
});
});

//post request for checking registration email
app.post('/regcheckemail',function(req,res){
  console.log(req.body.email);
 db.userslist.count({email:req.body.email},function(err,doc){
  res.json(doc);
});
});

//post request for checking registration mobile number check
app.post('/regmobcheck',function(req,res){
  console.log(req.body.mnumber);
 db.userslist.count({mnumber:req.body.mnumber},function(err,doc){
  res.json(doc);
});
});

//post request for posting the registration details to database
app.post('/registration', function (req, res) {
  console.log(req.body);

  var otp=Math.floor(1000 + Math.random() * 9000);

  db.userslist.insert(req.body, function(err, doc) {
    
  });
  
  db.userslist.update({email: req.body.email}, {$set: {otp: otp}},function(err,doc){
    res.json(otp);

    var c = new TMClient('arunchiluveru', '0Bler6uC6TKLtsYZUCaCQ0FWIhoNhA');
    c.Messages.send({text: otp, phones:req.body.mnumber}, function(err, res){
    console.log('Messages.send()', err, res);
});
  });
});

//post request for updating the image to the profile
app.post('/updateprofile',function(req,res){
  console.log(req.body.id);
  db.userslist.update({otp:req.body.id},{$set:{uimage:req.body.uimg}},function(err,doc){
    res.json(doc);
  });
})

//post request for checking OTP
app.post('/checkotpnum',function(req,res){
  console.log(req);
  db.userslist.count({otp:req}, function(err,doc){
    res.json(doc);
  });
});

app.listen(3000);
console.log("Server running on port 3000");
