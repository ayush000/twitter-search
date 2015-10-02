var express = require('express');
var router = express.Router();
var pg = require('pg');
router.get('/',function(req,res,next)
{
    //res.render('signup');
    res.render('signup');
});
router.post('/',function(req,res)
{
    pg.connect(process.env.DATABASE_URL
        || "postgres://klunfsfdwbevma:bFLgS8c-TUNKh_dR606C3Tv0XH@ec2-75-101-162-243" +
        ".compute-1.amazonaws.com:5432/d18guk57b2gvsh"
            ,function(err,client,done)
    {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

    //console.log(req.body.username);
    var error=false;
    var user_error="";
    var pass_error="";
    var verify_error="";
    var email_error="";
    var username=req.body.username;
    var password=req.body.password;
    var verify=req.body.verify;
    var email=req.body.email;
    if(!/^[a-zA-Z0-9.\-_$@*!]{3,30}$/.test(username.toString()))            //Username not valid
    {
        console.log("Username error");
        error=true;
        user_error="Enter a  valid username.";
    }
    else
    {
        client.query('select exists(select 1 from users where username=$1)',[username],function(err,alreadyExists)
        {
            done();
            if (err) {
                return console.error('error running query', err);
            }
            console.log(alreadyExists+" which is "+typeof result);
            if(alreadyExists)
            {
                error=true;
                user_error="User already exists"
            }
        });
        console.log("Username is fine");
        //console.log("EMAIL is "+email.toString());
    }
    if(!/^.{3,20}$/.test(password.toString()))
    {
        console.log("Password error");
        error=true;
        pass_error="Enter a valid password.";
    }
    else if(password!=verify)
    {
        console.log("Password verify error");
        error=true;
        verify_error="Passwords don't match"
    }
    if(email!="")
    {
        console.log(email);
        if(!/^\S+@\S+\.\S+$/.test(email.toString()))
        {
            console.log("email hass error")
            error=true;
            email_error="Please enter a valid email"
        }
    }
    else
    {
        console.log("Email is blank");
    }
    if(error)
    {
        res.render('signup',{user: username,user_error: user_error,pass_error: pass_error,verify_error: verify_error,email_error: email_error,user_email: email});
    }
    else
    {
        res.send("Registration is successful")
    }
    });
});

module.exports = router;