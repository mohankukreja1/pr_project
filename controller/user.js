const express=require('express');
const path =require('path');
const router=express.Router();
const bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var User = require('../db/user').user;
const passport=require('passport');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth:{
		user: 'deepakalpha11@gmail.com',
		pass: 'deepak@77'
	},
	tls: {
		rejectUnauthorized: false
	}


});

router.post('/patient',function(req,res){
    console.log(req);
    var ans = req.body.gender+','+req.body.age+','+req.body.cigsday+','+req.body.bpmeds+','+req.body.prevelant_strokes+','+req.body.diabetes+','+req.body.totchol+','+req.body.bmi+','+req.body.hRate+','+req.body.glucose;

    fs.writeFile(path.resolve(__dirname, "../frontendWithLogin/test.txt"), ans, function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
        res.redirect('/user-login')
    }); 
})
// router.get('/data',function(req,res){
//     var ans = req.user.firstname + " " + req.user.lastname;
//     res.json(ans);
// })
router.get('/logout',function (req,res) {

    req.logout();
    res.redirect('/');
})

router.get('/sendmail',isUser,function(req,res){
    //console.log(req.user);
    var data = fs.readFileSync(path.resolve(__dirname, "../frontendWithLogin/result.txt"));
    var ans =data.toString(); 
    console.log(ans);

    var mailOptions = {
        from: 'deepakalpha11@gmail.com',
        to: `jasmeetsingh585@gmail.com`,
        subject:'tu chu hai',
        text: `${ans}`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.redirect('/user-login');
        }
    })
})




router.use('/',express.static(path.join(__dirname ,'../frontendWithoutLogin')));
router.use('/user-login',express.static(path.join(__dirname ,'../frontendWithLogin')));
router.use('/help',express.static(path.join(__dirname ,'../frontendWithLogin/templates')))

router.post('/updateInfo',function(req,res){
    // User.findOne({email: req.user.email},function(err,data){
    //         if(err){
    //             throw err;
    //         }
    //         console.log(data)
    // })
    console.log(req);
    var query = {email : req.user.email};
    User.update(query,{family_name : req.body.username , family_emailid : req.body.email , phone: req.body.phone} , function (err,data) {
        console.log(data);
        res.redirect('/user-login');
    })
})


router.post('/login', passport.authenticate('user.login',{


	failureRedirect: '/signup.html',
	failureFlash: true

}),function (req,res) {
    console.log(req);
	res.redirect('/user-login');
})

router.post('/signup', function(req,res){
    console.log(req);
	User.findOne({'email':req.body.email},function (err,user) {
		if(err){
			throw err;
		}
		else if(user){
			
			res.redirect('/signup.html')
		}

		console.log(req);
		var newUser=new User();
		newUser.typeOf = 'Student';
		newUser.firstname  = req.body.first;
		newUser.lastname = req.body.last;
		
		newUser.email=req.body.email;
        newUser.password=newUser.encryptPassword(req.body.password);
		newUser.save(function (err) {
			if(err) throw (err);

			return res.redirect('/user-login');
		})
	})

    })
    
    function isUser(req,res,next){
        if(!req.user){
            return res.redirect('/login.html')
        }
        return next();
    }

module.exports = router;