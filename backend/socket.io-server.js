const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {cors: {origin: "*"}});
var cors = require('cors');

const jwt = require("jsonwebtoken")

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));


let iter = 0  
let ConnectedUsers = {} //storing sockets of users.


io.on('connection',(socket)=>{
    try{
        
        const {USER_ID} = jwt.verify(socket.handshake.query.token,process.env.SECRET_KEY)
        ConnectedUsers[USER_ID] = socket

        console.log('[',iter,']','User Connected: ',USER_ID,'{',socket,'}')
        iter = iter + 1

    }catch(error){
        console.log(error)
        console.log('\n\n')
        

    }
})



server.listen(8000,()=>{
    console.log('SOCKET IO SERVER LISTENING ON PORT 8000')
})