const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');

const app            = express();

const port = 3000;

//routing
const APIroutes = require('./app/APIroutes');
app.use('/api', APIroutes);

//to handle url encoded content
app.use(bodyParser.urlencoded({ extended: true }));

//set up database connection
MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)
  require('./app/routes')(app, database);
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });               
})


app.listen(port, function(){
    console.log("listening on port " + port);
});