module.exports = function(app, db){
    //______________________________________________CREATE USER________________________________________________
    app.post('/api/createuser', function(req, res){
        new_uid = Date.now();
        const user = { uid : new_uid, fname : req.body.fname, lname : req.body.lname, email : req.body.email }

        if(user.uid == null)
            return res.send({'error' : 'Error creating user'});
        else if(user.fname == null)
            return res.send({'error' : 'First name is required'});
        else if(user.lname == null)
            return res.send({'error' : 'Last name is required'});
        else if(user.email == null)
            return res.send({'error' : 'Email is required'});
        
        if(db.collection('users').findOne({email : user.email}) != null) //do not allow duplicate emails
            return res.send({'error' : 'Email is already in use'});
        

        db.collection('users').insert(user, function(err, result){
            console.log(user);
            if (err) { 
                res.send({ 'error': err }); 
            } else {
                console.log("new user: "+new_uid);
                res.send({ 'result' : result });
            }
          });
    }); 

    //_____________________________________________
}