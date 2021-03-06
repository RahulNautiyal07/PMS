var express = require('express');
var router = express.Router();
var bcrypt= require('bcryptjs');
var jwt = require('jsonwebtoken');
var userModule=require('../modules/user');
var passCatModel =require('../modules/passordCategory');
var  passwordModel=require('../modules/add_password');
const { check, validationResult } = require('express-validator');

var getPassCat=passCatModel.find({});
var getpassword=passwordModel.find({});

router.use(express.static(__dirname+"./public/"));

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


// ----------------------------------------(middlewares)------------------------------------------------

function checkLoginUser(req,res,next){
var userToken=localStorage.getItem('userToken');
try {
  var decoded = jwt.verify(userToken, 'logintoken');
} catch(err) {
  res.redirect('/');
}
next();
}


function checkEmail(req,res,next){
   var email=req.body.email;
   var checkexitemail=userModule.findOne({email:email});
   checkexitemail.exec((err,data)=>{
   	if(err) throw err;
      if(data){
      	 return res.render('signup', { title: 'Password Management System',msg:'Email Already Exists' });

      }
     next();
   });

}

function checkUser(req,res,next){
   var username=req.body.uname;
   var checkexitemail=userModule.findOne({username:username});
   checkexitemail.exec((err,data)=>{
   	if(err) throw err;
      if(data){
      	 return res.render('signup', { title: 'Password Management System',msg:'UserName Already Exists' });

      }
     next();
   });

}

router.get('/',checkLoginUser,function(req,res,next){
    var loginUser=localStorage.getItem('loginUser');
res.render('dashboard',{title:'Password Management System',loginUser:loginUser});		
})

module.exports=router;
