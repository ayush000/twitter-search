var express = require('express');
var router = express.Router();
var pg = require('pg');
var async = require('async');
router.get('/', function (req, res, next) {
    //res.render('signup');
    res.render('signup');
});
router.post('/', function (req, res) {
    var error = false;
    var user_error = "";
    var pass_error = "";
    var verify_error = "";
    var email_error = "";
    var username = req.body.username;
    var password = req.body.password;
    var verify = req.body.verify;
    var email = req.body.email;

    var renderSignup=function(user_error,pass_error,verify_error,email_error)
    {
        //var username=req.body.username;

        username = typeof username!== 'undefined' ? username : "";
        //user_error = typeof user_error !== 'undefined' ? user_error : "";
        //pass_error = typeof pass_error!== 'undefined' ? pass_error : "";
        //verify_error= typeof verify_error!== 'undefined' ? verify_error : "";
        //email_error = typeof email_error!== 'undefined' ? email_error : "";
        email = typeof email!== 'undefined' ? email : "";
        res.render('signup', {
            user: username,
            user_error: user_error,
            pass_error: pass_error,
            verify_error: verify_error,
            email_error: email_error,
            user_email: email
        });
    };
    //var locked = true;
    pg.connect(process.env.DATABASE_URL || "postgres://" +
            "swarn:gtalk123@" +
        //"socomo14:gtalk123@" +
        "localhost:5432"
        , function (err, client, done) {
            if (err) {
                throw err;
                //return console.error('error fetching client from pool', err);
            }
            var checkUsername=function(callback)
            {
                console.log("Username is "+username);
                if (!/^[a-zA-Z0-9.\-_$@*!]{3,30}$/.test(username.toString()))            //Username not valid
                {
                    console.log("Username error");
                    user_error = "Enter a  valid username.";
                    error=true;
                    //renderSignup(user_error,"","","");
                }
                else
                {
                    client.query('select exists(select 1 from users where username=$1)', [username], function (err, result)
                    {
                        console.log("DB query (user) to check existence: "+result.rows[0].exists);
                        done();
                        if (err) {
                            return console.error('error running query', err);
                        }
                        //console.log("DB query gives " + result.rows[0].exists + " which is " + typeof result.rows[0].exists);
                        if (result.rows[0].exists) {
                            error=true;
                            user_error = "User already exists";
                        }
                    });

                }
                console.log("END: Username is "+username);
                callback(null,error);

            };

            //if (!/^[a-zA-Z0-9.\-_$@*!]{3,30}$/.test(username.toString()))
            //{
            //    console.log("Username error");
            //    error = true;
            //    user_error = "Enter a  valid username.";
            //}


            /*    else {
             //asyncCall=true;
             client.query('select exists(select 1 from users where username=$1)', [username], function (err, result)
             //client.query('select username from users',function(err,result)
             {
             done();
             if (err) {
             return console.error('error running query', err);
             }
             console.log("DB query gives " + result.rows[0].exists + " which is " + typeof result.rows[0].exists);
             if (result.rows[0].exists) {

             console.log("Error set");
             error = true;
             console.log("error status after setting is " + error);
             user_error = "User already exists";
             //res.render('signup', {
             //    user: username,
             //    user_error: user_error,
             //    pass_error: pass_error,
             //    verify_error: verify_error,
             //    email_error: email_error,
             //    user_email: email
             //});
             }
             //locked = false;
             //console.log("locked after query? " + locked);
             });
             console.log("locked after query? " + locked);

             //console.log("EMAIL is "+email.toString());
             }*/
            //};
            var check_password=function(callback) {
                console.log("password is "+password)
                if (!/^.{3,20}$/.test(password.toString())) {
                    console.log("Password error");
                    error = true;
                    pass_error = "Enter a valid password.";
                }
                else if (password != verify) {
                    console.log("Password verify error");
                    error = true;
                    verify_error = "Passwords don't match"
                }
                console.log("END: password is "+password);
                callback(null);
            };
            var check_email = function(callback) {
                console.log("email is "+email);
                if (email != "") {
                    //console.log(email);
                    if (!/^\S+@\S+\.\S+$/.test(email.toString())) {
                        console.log("email hass error")
                        error = true;
                        email_error = "Please enter a valid email"
                    }
                    else
                    {
                        client.query('select exists(select 1 from users where email=$1)', [email], function (err, result) {
                            console.log("DB query to check existence: "+result.rows[0].exists);
                            done();
                            if(err)
                            {
                                return console.error('error running query', err);
                            }


                        if (result.rows[0].exists) {

                            error=true;
                            email_error="User with same email exists";
                            //renderSignup();
                        }
                        else
                        {
                            res.send("Registration successful");
                        }
                        });
                    }
                }
                //else {
                    //console.log("Email is blank");
                //}
                //callback();
                console.log("END: email is "+email);
                callback(null);
            };
            //var renderPage = function () {
            //console.log("Error status before checking email is " + error);
            //query.on('row',function(row)
            //{

            //var renderPage=function() {
            //console.log("lock before render?: " + locked);
            //if (!locked) {




            /*var checkEmail=function(user_email,renderSignup)
            {
                client.query('select exists(select 1 from users where email=$1)', [user_email], function (err, result) {
                    done();
                    if(err)
                    {
                        return console.error('error running query', err);
                    }

                });
                if (result.rows[0].exists) {
                    error=true;
                    email_error="User with same email exists";
                    renderSignup();
                }
                else
                {
                    res.send("Registration successful");
                }
            };*/


            /*if (error) {
                renderSignup();
            }
            else {
                client.query('select exists(select 1 from users where username=$1)', [username], function (err, result) {
                    done();
                    if (err) {
                        return console.error('error running query', err);
                    }
                    console.log("DB query gives " + result.rows[0].exists + " which is " + typeof result.rows[0].exists);
                    if (result.rows[0].exists) {

                        console.log("Error set");
                        error = true;
                        console.log("error status after setting is " + error);
                        user_error = "User already exists";
                        renderSignup();
                    }
                    else {
                        if(typeof user_email ===undefined) {
                            res.send("Registered successfully")
                        }
                        else
                        {
                            checkEmail(user_email,renderSignup);
                        }
                        //console.log("Check email is successful");

                        //client.query('insert into users values ($1, $2, $3)',[username,password,email]);
                    }
                    //locked = false;
                    //console.log("locked after query? " + locked);
                });

            }*/
            //}
            //};
            //async.series(userCheck(), [renderPage()]);
            //});
            async.parallel([checkUsername,check_email,check_password],function(err,result)
            {
                error=result||false;
                console.log("callback of async query with error="+error);
                if(err)
                {
                    console.log("Async error: "+err);
                }
                //console.log("Parallel working fine");
                if(error===true)
                {
                    renderSignup(user_error,pass_error,verify_error,email_error);
                }
                else
                {
                    res.send("Registered");
                }
            })
        })
});

module.exports = router;