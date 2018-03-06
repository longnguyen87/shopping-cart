var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require ("cookie-parser");
var expressSession = require ("express-session");
var path = require ("path");

require ("./mongooseDB/dbConnection.js");
require ("./mongooseDB/cart-model");
var app= express();

app.engine(".html", require("ejs").__express);
app.set ("view engine", "html");
app.set ("views", path.resolve(__dirname,"views"))
// statis resources
app.use (express.static(__dirname +"/public"));
console.log("base static", __dirname+"/public");

app.use (bodyParser.json());
app.use (bodyParser.urlencoded({extended: false}));
app.use (cookieParser());
app.use (expressSession({
  secret: "SECRET",
  cookie: {maxAge: 60*60*5000},
  resave: true,
  saveUninitialized: true
}))
// setting Route

var routes = require ("./routes/index.js");
app.use ("/", routes);
app.use(function(req, res) {
    res.status(404);
    res.render('404');
});
app.listen(3000, function(){
  console.log('http://localhost:3000');
});