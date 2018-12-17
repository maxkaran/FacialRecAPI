module.exports = function(app, db){
    //______________________________________________CREATE USER________________________________________________
    app.post('/api/createuser', function(req, res){
        new_uid = Date.now(); //user ID is just current time, since we have no risk of user accounts being created at the same time

        const user = { uid : new_uid, fname : req.body.firstname, lname : req.body.lastname, email : req.body.email, password : req.body.password }

        if(user.uid == null)
            return res.send({'error' : 'Error creating user'});
        else if(user.fname == null)
            return res.send({'error' : 'First name is required'});
        else if(user.lname == null)
            return res.send({'error' : 'Last name is required'});
        else if(user.email == null)
            return res.send({'error' : 'Email is required'});
        else if(user.password == null)
            return res.send({'error' : 'Password is required'});

        if(db.collection('users').findOne({email : user.email}, function(err,result){
            if(result != null)
                res.send({'error' : 'Email is already in use'});
            else{ //if email is not in database, insert user
                db.collection('users').insert(user, function(err, result){
                    if (err) { 
                        res.send({ 'error': JSON.stringify(err) }); 
                    } else {
                        console.log("new user: "+new_uid);
                        res.send({ 'result' : JSON.stringify(result) });
                    }
                  });
            }
        })); //do not allow duplicate emails
            
        

        
    }); 

    //_____________________________________________
}