module.exports = function(app, db){

    const path = require('path');
    const fs = require('fs');
    const multer = require('multer');
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, __dirname+'/../../uploads/');
        },
        filename: (req, file, cb) => {
          const newFilename = `${Date.now()}${path.extname(file.originalname)}`;
          cb(null, newFilename);
        }
    });
    const upload = multer({ storage});

    //______________________________________________CREATE USER________________________________________________
    app.post('/api/createuser', function(req, res){
        new_uid = Date.now(); //user ID is just current time, since we have no risk of user accounts being created at the same time

        const user = { //create user var for the database
            uid : new_uid, 
            fname : req.body.firstname, 
            lname : req.body.lastname, 
            email : req.body.email, 
            password : req.body.password 
        };

        //check the fields and return errors if invalid
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

        if(db.collection('users').findOne({email : user.email}, function(err,result){ //check if email is in use
            if(result != null)
                res.send({'error' : 'Email is already in use'});
            else{ //if email is not in database, insert user
                db.collection('users').insert(user, function(err, result){
                    if (err) { 
                        res.send({ 'error': JSON.stringify(err) }); 
                    } else {
                        console.log("new user: "+new_uid);
                        res.send({ 'result' : JSON.stringify(result) }); //send back result on success
                    }
                  });
            }
        })); //do not allow duplicate emails        
    }); 

    //_____________________________________________Get User Info_______________________________________________
    app.post('/api/getuser', function(req,res){ //with email and password for authenticationk
        const auth = {password : req.body.password, email : req.body.email};
        
        if(auth.password == null || auth.email == null){ //make sure both are present
            return res.send({error : 'password and email are required to authenticate'});
        }

        db.collection('users').findOne({email : auth.email}, function(err, result){
            if(result == null){ //check if email is actually in the databse
                res.send({error : 'No account with this email'});
            }else{ //make sure password is correct
                if(auth.password == result.password){
                    console.log('Authenticated!');
                    res.send(result); //send user data if authenticated properly
                }
            }
        });

    });

    //______________________________________________Create Faces (Authorized Entrants for lock)___________________________________
    app.post('/api/createface', upload.any(), (req, res) => {
        new_fid = Date.now(); //face ID is just current time, since we have no risk of user accounts being created at the same time

        const face = { //create face var for the database
            fid : new_fid, 
            email : req.body.email, //account this face is associated with
            password : req.body.password,
            fname : req.body.firstname, //name of new face
            lname : req.body.lastname,
            fullaccess : req.body.fullaccess, //does face have unlimited access or is it timed
            files : req.body.files
        };

        fs.mkdir(__dirname+'/../../uploads/'+face.fid);

        for (let i = 0; i < req.files.length; i += 1) {
            fs.rename(req.files[i].path, path.dirname(req.files[i].path)+'/'+face.fid+'/'+path.basename(req.files[i].path));
        }

        //check the fields and return errors if invalid
        if(face.fid == null)
            return res.send({'error' : 'Error creating face'});
        else if(face.email == null)
            return res.send({'error' : 'email is required'});
        else if(face.password == null)
            return res.send({'error' : 'password is required'});
        else if(face.fname == null)
            return res.send({'error' : 'First name is required'});
        else if(face.lname == null)
            return res.send({'error' : 'Last name is required'});
        else if(face.fullaccess == null)
            return res.send({'error' : 'Access Type is required'});

        if(db.collection('users').findOne({email : face.email}, function(err,result){ //find user
            if(result == null)
                res.send({error : 'This account does not exist'});
            else if(result.password != face.password){ //check if password matches
                res.send({error : 'Password incorrect'});
            }else{
                db.collection('faces').insert(face, function(err, result){
                    if (err) { 
                        res.send({ 'error': JSON.stringify(err) }); 
                    } else {
                        console.log("new face: "+new_fid);
                        res.send({ result : result }); //send back result on success
                    }
                });
            }
        })); //do not allow duplicate emails     
    }); 

    //_____________________________________Get Faces (Authorized Entrants for lock)_________________________________________________________
    app.post('/api/getfaces', function(req,res){ //with email and password for authentication
        const auth = {password : req.body.password, email : req.body.email};
        
        if(auth.password == null || auth.email == null){ //make sure both are present
            return res.send({error : 'password and email are required to authenticate'});
        }

        db.collection('users').findOne({email : auth.email}, function(err, result){
            if(result == null){ //check if email is actually in the databse
                res.send({error : 'No account with this email'});
            }else{ //make sure password is correct
                if(auth.password == result.password){
                    console.log('Authenticated!');
                    //authenticated properly, now get faces from database
                    
                    db.collection('faces').find({email : auth.email}).toArray(function(err, result){
                        if(err){
                            res.send({error : err});
                        }
                        else{
                            res.send(result);
                        }
                    });
                }
            }
        });

    });

    app.post('/api/deleteface', function(req,res){
        const auth = {password : req.body.password, email : req.body.email, fid : req.body.fid};

        db.collection('users').findOne({email : auth.email}, function(err, result){
            if(result == null){ //check if email is actually in the databse
                res.send({error : 'This face does not exist'});
            }else{ //make sure password is correct
                if(auth.password == result.password){
                    //authenticated properly, now get faces from database
                    db.collection('faces').remove({fid : auth.fid}, function(err, result){
                        if(err){
                            res.send({error : err});
                        }
                        else{
                            res.send(result);
                        }
                    });
                }
            }
        });
    });

    app.post('/api/getfaces/:faceID', function(req, res){
        const auth = {password : req.body.password, email : req.body.email, fid : req.params.faceID};

        db.collection('users').findOne({email : auth.email}, function(err, result){
            if(result == null){ //check if email is actually in the databse
                res.send({error : 'No account with this email'});
            }else{ //make sure password is correct
                if(auth.password == result.password){
                    //authenticated properly, now edit face
                    db.collection('faces').findOne({fid : parseInt(auth.fid)}, function(err, result){
                            if(err){
                                res.send({error : err});
                            }
                            else{
                                var picturePaths = new Array();
                                fs.readdir(__dirname+'/public/uploads/'+auth.fid, (err, files) => {
                                    files.forEach(file => {
                                        picturePaths.push('/publics/uploads/'+auth.fid+'/'+file);
                                    });
                                    res.send({result: result, pictures: picturePaths});
                                })
                        }
                    });
                }
            }
        });
    });

    app.post('/api/editface/:faceID', function(req, res){
        const auth = {password : req.body.password, email : req.body.email, fid : req.params.faceID};

        db.collection('users').findOne({email : auth.email}, function(err, result){
            if(result == null){ //check if email is actually in the databse
                res.send({error : 'No account with this email'});
            }else{ //make sure password is correct
                if(auth.password == result.password){
                    //authenticated properly, now edit face
                    db.collection('faces').update({fid : auth.fid}, 
                        {
                            fullaccess: req.body.fullaccess,
                            fname: req.body.firstname,
                            lname: req.body.lname
                        },
                        function(err, result){
                            if(err){
                                res.send({error : err});
                            }
                            else{
                                res.send(result);
                            }
                        });
                }   
            }
        });
    });
}