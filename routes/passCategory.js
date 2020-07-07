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
      getPassCat.exec(function(err,data){
    if(err) throw err;
  res.render('password_category', { title: 'Password Management System',loginUser:loginUser,records:data });

   })
});

router.get('/edit/:id',checkLoginUser,function(req,res,next){
    var loginUser=localStorage.getItem('loginUser');
    var passCatId=req.params.id;
    console.log(passCatId);
    var getpassCategory=passCatModel.findById(passCatId);
      getpassCategory.exec(function(err,data){
    if(err) throw err;
  res.render('edit_pass_category', { title: 'Password Management System',loginUser:loginUser,errors:'',success:'',records:data,id:passCatId });

   })
});

router.post('/edit/',checkLoginUser,function(req,res,next){
    var loginUser=localStorage.getItem('loginUser');
    var passCatId=req.body.id;
    var passwordCategory=req.body.passwordCategory;

    var update_passCategory=passCatModel.findByIdAndUpdate(passCatId,{password_category:passwordCategory})
   
      update_passCategory.exec(function(err,doc){
    if(err) throw err;
  res.redirect('/passCategory');

   })
});

router.get('/delete/:id',checkLoginUser,function(req,res,next){
    var loginUser=localStorage.getItem('loginUser');
    var passCatId=req.params.id;
    console.log(passCatId);
    var passdelete=passCatModel.findByIdAndDelete(passCatId);
      passdelete.exec(function(err){
    if(err) throw err;
  res.redirect('/passCategory');

   })
});


module.exports=router;
