const mongoose=require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.connect("mongodb://localhost:27017/pms",{useNewUrlParser:true,useCreateIndex:true, useUnifiedTopology: true });
var conn=mongoose.Collection;

var passSchema=new mongoose.Schema({
    password_category:{
    type:String,
    required:true,
    index:{
    	unique:true,
    }},
     project_name:{
    type:String,
    required:true,
   },
     password_details:{
    type:String,
    required:true,
   },
    date:{
    	type:Date,
    	default:Date.now 
    }	


});

// passSchema.plugin(mongoosePaginate);
// var passModel=mongoose.model('password_details',passSchema);
// module.exports=passModel;
passSchema.plugin(mongoosePaginate);
var passModel = mongoose.model('password_details', passSchema);
module.exports=passModel;






