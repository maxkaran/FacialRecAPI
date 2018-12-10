const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');

const app            = express();

const port = 3000;

//routing
const APIroutes = require('./app/APIroutes');
app.use('/api', APIroutes);


app.listen(port, function(){
    console.log("listening on port " + port);
});