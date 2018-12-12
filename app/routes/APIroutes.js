module.exports = function(app, db){
    app.get('/notes', function(req, res){
        // You'll create your note here.
        res.send('Hello');
    });
}