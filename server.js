const express = require("express")
const app=express()
const ejs= require("ejs")
const path= require("path")
const expressLayout = require("express-ejs-layouts")
const PORT=process.env.PORT || 3000

app.get('/',function(req,res){
    res.render("home")
})

// Set Tempalte Engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set("view engine",'ejs')


app.listen(3000,function(){
    console.log('listening on Port 3000')

})