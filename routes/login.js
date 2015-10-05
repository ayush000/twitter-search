var express = require('express');
var router = express.Router();
var pg = require('pg');
var async = require('async');

router.get('/', function (req, res, next) {
    res.render('login');
    console.log("get: "+req.body.login);
});
router.post('/', function (req, res) {
    var username=req.body.username;
    var password=req.body.password;
    var renderLogin=function(username)
    {
        username = typeof username!== 'undefined' ? username : "";
        res.render('login', {
            user: username,
            user_error: user_error,
            pass_error: pass_error
        });
    };
    var user_error = "";
    var pass_error = "";
    //res.send('Homepage');
    //console.log(req.body.login);
    console.log(Object.keys(req.body));
    //res.send('Homepage');

    if(req.body['login'])
    {
        //res.send("Logged in")
        pg.connect(process.env.DATABASE_URL || "postgres://" +
                //"swarn:gtalk123@" +
            "socomo14:gtalk123@" +
            "localhost:5432"
            , function (err, client, done) {
                if(err)
                {
                    throw err;
                }
                var checkUsername = function(callback)
                {
                    client.query('select * from users where username=$1',[req.body.username],function(err,result)
                    {
                        //console.log("Keys: "+Object.keys(result.rows[0])+" type is : "+typeof result.rows[0]);
                        //console.log("result is: "+result.rows[0].username+" "+result.rows[0].password);
                        //console.log("length is: "+Object.keys(result.rowAsArray[0]));
                        //console.log("L: "+result.rowAsArray.length);
                                //.length);
                                //[0].username);
                        if(err)
                        {
                            callback(err);
                        }
                        if(result.rows.length==0)
                        {
                            user_error="User does not exist";
                            callback(null,true);
                        }
                        else
                        {
                            checkPassword(result.rows[0].password,callback);
                        }

                    })
                };

                var checkPassword = function(pass, callback)
                {
                    console.log("Checking password... DB: "+pass+" form: "+req.body.password);
                    if(req.body.password===pass)
                    {
                        console.log("Passwords match");
                        callback(null,false);
                    }
                    else
                    {
                        console.log("Passwords don't match");
                        pass_error="Password invalid";
                        callback(null,true);
                    }
                };
                checkUsername(function(err,resultError)
                {
                    if(resultError)
                    {
                        //res.send("Login not successful");
                        renderLogin(req.body.username);

                    }
                    else
                    {
                        res.send("Login successful")
                    }
                });
            });
    }
    else
    //if(req.body.signup)
    {
        res.redirect('/signup');
    }
    //res.send("Running")
});
//router.post('/signup', function (req, res) {
//    console.log("redirect succesful");
//    res.send('redirected')
//});


module.exports = router;