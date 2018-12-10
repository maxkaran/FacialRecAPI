const APIroutes = require('./APIroutes');

module.exports = function(app, db) {
    APIroutes(app, db);
    //room for future routes (for frontend for example)
}