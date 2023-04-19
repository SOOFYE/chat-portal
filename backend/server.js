const express = require('express')
const app  = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')

const bodyParser = require('body-parser');


require('dotenv').config();


app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json())
app.use(cookieParser());

// app.use(express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require("mongoose")
mongoose.connect(process.env.ATLAS_URI,{useNewUrlParser:true})
mongoose.connection.once("open",()=>{
    console.log("MongoDB database connection established successfully")
})

const Sign_log_routes = require("./routes/Sign_log.js")
app.use('/',Sign_log_routes)

const Chatting = require('./routes/Chatting')
app.use('/',Chatting)

const FTPSERVER = require('./routes/FTP.js')
app.use('/',FTPSERVER)


app.listen(5000,()=>{
    console.log('Server Listening on PORT 5000')
})