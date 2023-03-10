<<<<<<< HEAD
require('dotenv').config()
const express = require("express")
const app=express()
const ejs= require("ejs")
const path= require("path")
const expressLayout = require("express-ejs-layouts")
const PORT=process.env.PORT || 3000

const mongoose= require('mongoose')
const { error } = require("console")
const session= require('express-session')
const flash= require('express-flash')
const MongoDBStore= require('connect-mongo')
const passport= require('passport')
const Emitter = require('events')


 

//Database Connection
mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_CONNECTION_URL,{useNewUrlParser:true,useUnifiedTopology:true});
const Connection=mongoose.connection;
Connection.once('open',()=>{
  console.log("Database Connected..");

}).on('error', function (err) {
  console.log("Connection Failed");
});


// Event emitter
const eventEmitter =  new Emitter()
app.set('eventEmitter',eventEmitter)

//Session-config
 
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave:false,
  store:MongoDBStore.create({
    mongoUrl: process.env.MONGO_CONNECTION_URL
}),

  saveUninitialized:false,
  cookie:{maxAge:1000*60*60*24}
    // 24 Hours
   
}))
// Passport-config
const passportInit=require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash())

//Assets
app.use(express.static('public'))
app.use(express.urlencoded({ extended:false }))
app.use(express.json())

// Global middleware
app.use((req,res,next)=>{
  res.locals.session=req.session
  res.locals.user=req.user
  next()
  
})



// Set Tempalte Engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set("view engine",'ejs')

// call routes func
require('./routes/web.js')(app)

// Routes
//Moved to Routes

//Listening
const server=app.listen(3000,function(){
    console.log('listening on Port 3000')

})


// Socket

const io = require ('socket.io')(server)

io.on('connection',(socket)=>{
  // Join 
  // console.log(socket.id)
  socket.on('join',(roomName)=>{
    socket.join(roomName)

  })
})


eventEmitter.on('orderUpdated',(data)=>{
  io.to(`order_${data.id}`).emit('orderUpdated',data)

})




eventEmitter.on('orderPlaced',(data)=>{
  io.to('adminRoom').emit('orderPlaced',data)
})

=======
require('dotenv').config()
const express = require("express")
const app=express()
const ejs= require("ejs")
const path= require("path")
const expressLayout = require("express-ejs-layouts")
const PORT=process.env.PORT || 3000

const mongoose= require('mongoose')
const { error } = require("console")
const session= require('express-session')
const flash= require('express-flash')
const MongoDBStore= require('connect-mongo')
const passport= require('passport')
const Emitter = require('events')


 

//Database Connection
mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_CONNECTION_URL,{useNewUrlParser:true,useUnifiedTopology:true});
const Connection=mongoose.connection;
Connection.once('open',()=>{
  console.log("Database Connected..");

}).on('error', function (err) {
  console.log("Connection Failed");
});


// Event emitter
const eventEmitter =  new Emitter()
app.set('eventEmitter',eventEmitter)

//Session-config
 
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave:false,
  store:MongoDBStore.create({
    mongoUrl: process.env.MONGO_CONNECTION_URL
}),

  saveUninitialized:false,
  cookie:{maxAge:1000*60*60*24}
    // 24 Hours
   
}))
// Passport-config
const passportInit=require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash())

//Assets
app.use(express.static('public'))
app.use(express.urlencoded({ extended:false }))
app.use(express.json())

// Global middleware
app.use((req,res,next)=>{
  res.locals.session=req.session
  res.locals.user=req.user
  next()
  
})



// Set Tempalte Engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set("view engine",'ejs')

// call routes func
require('./routes/web.js')(app)

// Routes
//Moved to Routes

//Listening
const server=app.listen(3000,function(){
    console.log('listening on Port 3000')

})


// Socket

const io = require ('socket.io')(server)

io.on('connection',(socket)=>{
  // Join 
  // console.log(socket.id)
  socket.on('join',(roomName)=>{
    socket.join(roomName)

  })
})


eventEmitter.on('orderUpdated',(data)=>{
  io.to(`order_${data.id}`).emit('orderUpdated',data)

})




eventEmitter.on('orderPlaced',(data)=>{
  io.to('adminRoom').emit('orderPlaced',data)
})

>>>>>>> f932a719e9b992dbf2f6a352e9297c1a15859d5f
