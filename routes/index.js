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


// -------------------------------------------(Login)---------------------------------------------------
/* GET home page. */
router.get('/', function(req,res,next) {
     var loginUser=localStorage.getItem('loginUser');
   if(loginUser){
    res.redirect('/dashboard');
   }
   else{
  res.render('index', { title: 'Password Management System',msg:''  });
}
});


router.post('/',function(req,res,next){
   var username=req.body.uname;
   var password=req.body.password; 
 
 var checkUser=userModule.findOne({username:username});
   checkUser.exec((err,data1)=>{
   
   	if(err) throw err;

      if(data1){
        
        var getUserId=data1._id;
      	var getPassword=data1.password;
     
      	if(bcrypt.compareSync(password,getPassword)){

         var token = jwt.sign({ userId: getUserId },'logintoken');
         localStorage.setItem('userToken',token);
         localStorage.setItem('loginUser',username);

         res.redirect('/dashboard');
      	}else{

      	  res.render('index', { title:'Password Management System',msg:'Invalid Username And Password.' });

         }
     }

   });

});

// -----------------------------------------------(DashBoard)-------------------------------------------


// --------------------------------------------Sign Up--------------------------------------------------


router.get('/signup',function(req,res,next){ 
  var loginUser=localStorage.getItem('loginUser');
   if(loginUser){
    res.redirect('/dashboard');
   }
   else{
  res.render('signup', { title: 'Password Management System',msg:''  });
}
});

router.post('/signup',checkEmail,checkUser,function(req,res,next){
	var username=req.body.uname;
	var email=req.body.email;
	var password=req.body.password;
	var confpassword=req.body.confPassword;
 
	 if(password!= confpassword){

	  res.render('signup', { title: 'Password Management System',msg:'Password Not Matched !'});


	 }else{
	 	 password=bcrypt.hashSync(password,10);
		var userDetails=new userModule({
	      username:username,
	      email:email,
	      password:password

		});
		userDetails.save((err,doc)=>{
			if(err) throw err;

	  res.render('signup', { title: 'Password Management System',msg:'User Register Successfully'});

		});
	 }


});

// -------------------------------------------(Logout)------------------------------------------------
router.get('/logout',function(req,res,next){
	localStorage.removeItem('userToken');
	localStorage.removeItem('loginUser');
     res.redirect('/');
});



// -------------------------------------(View Password Category)-----------------------------------------------




// -----------------------------------------(Add New Category)-----------------------------------------


//-----------------------------------------(View All Password)-----------------------------------

router.get('/viewPassword/',checkLoginUser,function(req,res,next){
   var loginUser=localStorage.getItem('loginUser');

  //  -------------------------------------Normal pagination ---------------------------------------
  var perPage =2;
  var page= 1;
  
  

   getpassword.skip((perPage * page)-perPage).limit(perPage).exec(function(err,data){
    if(err) throw err;

    passwordModel.countDocuments({}).exec((err,count)=>{
     res.render('viewAllPassword', { title: 'Password Management System',
     loginUser:loginUser,
     records:data,
     current:page,
     pages:Math.ceil(count/perPage) 
               });
        });
   });

 
});

router.get('/viewPassword/:page',checkLoginUser,function(req,res,next){
  var loginUser=localStorage.getItem('loginUser');

 //  --------------------------------------pagination--------------------------------------------
 var perPage =2;
 var page=req.params.page ;
 
 

  getpassword.skip((perPage * page)-perPage).limit(perPage).exec(function(err,data){
   if(err) throw err;

   passwordModel.countDocuments({}).exec((err,count)=>{
    res.render('viewAllPassword', { title: 'Password Management System',
    loginUser:loginUser,
    records:data,
    current:page,
    pages:Math.ceil(count/perPage) 
              });
       });
  });


});


/** 

router.get('/viewPassword/',checkLoginUser,function(req,res,next){
  var loginUser=localStorage.getItem('loginUser');

 //  -------------------------------------mongoose pagination ---------------------------------------


 var options = {
  offset:   1, 
  limit:    3
};
 
passwordModel.paginate({},options).then(function(result){
  //console.log(result);
 res.render('viewAllPassword', { title: 'Password Management System',
 loginUser: loginUser,
 records: result.docs,
   current: result.offset,
   pages: Math.ceil(result.total / result.limit) 
 });
 


});


});

router.get('/viewPassword/:page',checkLoginUser,function(req,res,next){
 var loginUser=localStorage.getItem('loginUser');

//  --------------------------------------pagination--------------------------------------------
var perPage =2;
var page=req.params.page ;



 getpassword.skip((perPage * page)-perPage).limit(perPage).exec(function(err,data){
  if(err) throw err;

  passwordModel.countDocuments({}).exec((err,count)=>{
   res.render('viewAllPassword', { title: 'Password Management System',
   loginUser:loginUser,
   records:data,
   current:page,
   pages:Math.ceil(count/perPage) 
             });
      });
   });
});

**/
router.get('/edit_password/edit/:id',checkLoginUser,function(req,res,next){
  var loginUser=localStorage.getItem('loginUser');
  var password_id=req.params.id;
  console.log(password_id);
  var getpassDetails=passwordModel.findById({_id:password_id});
     getpassDetails.exec(function(err,data){
          if(err) throw err;

          getPassCat.exec(function(err,data1){
            if(err) throw err;
            res.render('edit_password',{title:'Password Management System',loginUser:loginUser,success:'',records:data1,record:data});
        
          });
      });
  });
router.post('/edit_password',checkLoginUser,function(req,res,next){
  var id=req.body.id;
 var password_cat=req.body.pass_cat;
 var project=req.body.project;
 var pass_details=req.body.pass_details;

 var passUpdate=passwordModel.findByIdAndUpdate(id,{password_category:password_cat,project_name:project,password_details:pass_details});
 passUpdate.exec(function(err,doc){
   if(err) throw err;
   res.redirect('viewPassword');
   }) 
})



router.get('/viewPassword/delete/:id',function(req,res,next){
  var password_id=req.params.id;
  console.log(password_id);
   var passdelete=passwordModel.findByIdAndDelete(password_id);
   passdelete.exec(function(err,data){
    if(err) throw err;
    res.redirect('/viewPassword'); 

   });
});



// ------------------------------------(addNewPassword)-----------------------------------------
router.get('/addPassword',checkLoginUser,function(req,res,next){
 var loginUser=localStorage.getItem('loginUser');
 getPassCat.exec(function(err,data){
  if(err) throw err;

   res.render('addNewPassword',{title:'Password Management System',loginUser:loginUser,records:data,success:''});

 });
});

router.post('/addPassword',checkLoginUser,function(req,res,next){
 var loginUser=localStorage.getItem('loginUser');

 var pass_cat=req.body.pass_cat;
 var pass_detail=req.body.pass_details;
 var projects=req.body.project;

 var password_details=new passwordModel({
   password_category:pass_cat,
   project_name: projects,
   password_details:pass_detail

 })
 password_details.save(function(err,doc){
    getPassCat.exec(function(err,data){
  if(err) throw err;

   res.render('addNewPassword',{title:'Password Management System',loginUser:loginUser,records:data,success:' Added New Password'});

 });
 })

});





module.exports = router;
