const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const db = require('./config/db');
const app = express();

const port = process.env.PORT || 5000;

//to read JSON objects
app.use(bodyParser.json());
//to handle url encoded content
app.use(bodyParser.urlencoded({ extended: true }));

//set up database connection
MongoClient.connect(db.url, function(err, database){
    if (err) 
        return console.log(err); //print out error

    //routing
    require('./app/routes')(app, database);
  
    //start app up
    app.listen(port, '0.0.0.0', function(){
        console.log("API listening on port " + port);
    });             
});