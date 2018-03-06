var mongoose = require ("mongoose");
var credential = require ("./credentials");
var dbURL = "mongodb://" + credential.username + ":" + credential.password + "@" +
            credential.host + ":" + credential.port +"/" + credential.database;
mongoose.connect (dbURL);


