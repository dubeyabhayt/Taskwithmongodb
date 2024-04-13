const mongoose=require('mongoose');

const validationUser=new mongoose.Schema({
    
    username :{type:String,required:true},
    password:{type:String,require:true}
}) 
module.exports=mongoose.model("User",validationUser)