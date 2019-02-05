module.exports = function(app, db){

    const path = require('path');
    const fs = require('fs');
    var rimraf = require("rimraf");

    const multer = require('multer');
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, __dirname+'/../../react-app/public/uploads/');
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
            password : req.body.password,
            updated : true,
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
            files : req.body.files,
        };

        const base64images = JSON.parse(req.body.base64images)


        fs.mkdir(__dirname+'/../../react-app/public/uploads/'+face.fid);

        for (let i = 0; i < req.files.length; i += 1) {
            fs.rename(req.files[i].path, path.dirname(req.files[i].path)+'/'+face.fid+'/'+path.basename(req.files[i].path));
        }

        for(let i=0; i<base64images.length; i+= 1){
            console.log(i);
            console.log(__dirname+'/../../react-app/public/uploads/'+face.fid+'/'+Date.now()+'.jpeg');
            var data = Buffer.from(base64images[i].replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');
            fs.writeFile(__dirname+'/../../react-app/public/uploads/'+face.fid+'/'+Date.now().toString()+'.jpeg', data, function(err){
                console.log(__dirname+'/../../react-app/public/uploads/'+face.fid+'/'+Date.now()+'.jpeg');

                if(err){
                    console.log(err);
                    return res.send({'error' : 'Error saving files'});
                }
            });
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
                        
                        db.collection('users').update({email: face.email}, {$set:{updated: true}});
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
                    db.collection('users').update({email: auth.email}, {$set:{updated: true}}, function(err, result){
                        if(err)
                            return res.send({error: 'Failed to delete account'});

                        db.collection('faces').remove({fid : parseInt(auth.fid)}, function(err, result){
                            if(err){
                                res.send({error : err});
                            }
                            else{
                                rimraf.sync(__dirname+'/../../react-app/public/uploads/'+auth.fid+'/'); //delete directory with photos
                                res.send(result);
                            }
                        });
                    })
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
                                fs.readdir(__dirname+'/../../react-app/public/uploads/'+auth.fid, (err, files) => {
                                    files.forEach(file => {
                                        picturePaths.push('/uploads/'+auth.fid+'/'+file);
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
                        {$set:{
                            fullaccess: req.body.fullaccess,
                            fname: req.body.firstname,
                            lname: req.body.lname
                        }},
                        function(err, result){
                            if(err){
                                res.send({error : err});
                            }
                            else{
                                res.send(result);
                            }
                        }
                    );
                }   
            }
        });
    });

    app.post('/api/isupdated', function(req, res){
        console.log('isupdated');
        const email = req.body.email;
        db.collection('users').findOne({email: email}, function(err, result){
            if(err || result==null)
                return res.send({error: 'Problem checking account'});
            else{
                return res.send({updated: result.updated});
            }

        });
    });

    app.post('/api/update', function(req, res){
        const auth = {email: req.body.email, password: req.body.password};

        db.collection('users').findOne({email : auth.email}, function(err, result){
            if(result == null){ //check if email is actually in the databse
                res.send({error : 'No account with this email'});
            }else{ //make sure password is correct
                if(auth.password == result.password){
                    //once authenticated, find faces associated with this email
                    db.collection('faces').find({email : auth.email}).toArray(function(err, faces_result){
                        var return_faces = [];
                        for(let face of faces_result) {
                            files = fs.readdirSync(__dirname+'/../../react-app/public/uploads/'+face.fid); 
                            
                            var new_face = {
                                fullaccess : face.fullaccess,
                                fid : face.fid,
                                fname : face.fname,
                                lname : face.lname,
                                faces : []
                            };

                            for(let file of files) {
                                const image = fs.readFileSync(__dirname+'/../../react-app/public/uploads/'+face.fid+'/'+file); //read binary file data
                                new_face.faces.push(new Buffer(image).toString('base64')); //append the base64 encoded image
                            }

                            //add this face to return_faces
                            return_faces.push(new_face);
                        }
                        res.send(return_faces); //return to sender folks
                        
                        //now we have to update the database
                        db.collection('users').update({email: result.email}, {$set:{updated: false}}, function(err, result){
                            if(err){
                                console.log('error updating: '+err);
                            }
                        });
                    });
                }
            }
        });
    });
}