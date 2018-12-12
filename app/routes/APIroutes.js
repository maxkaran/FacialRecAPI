module.exports = function(app, db){
    app.post('api/createuser', function(req, res){
        const user = { uid : req.body.uid, fname : req.body.fname, lname : req.body.lname, email : req.body.email }
        db.collection('users').insert(user, function(err, result){
            console.log(user);
            if (err) { 
                res.send({ 'error': 'true' }); 
            } else {
                res.send(result);
            }
          });
    });
}