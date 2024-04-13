const express=require('express');
const app=express();
const mongoose=require('mongoose');
app.use(express.json()); 

const Router=require('./Route/UserRoute'); 
const storycontroller=require("./Controller/StoryController")


//mongodb://localhost:27017
// mongoose.connect('mongodb+srv://suryacrimsons:EiUVKjIr5cSrDm5y@cluster0.egt73ha.mongodb.net/Task')
mongoose.connect('mongodb://127.0.0.1:27017/Task')


// mongoose.connect('mongodb://localhost:27017/Task')
.then(()=>console.log("mongodb is connected"))
.catch((err)=>console.log(err.message)); 

app.use("/api",Router);
app.use("/api",storycontroller)

app.listen(3000,(err)=>{
if(!err){
    console.log("server is successfully running on 3000 port")
}
if(err){
    console.log("err occur server cant start");
}
})