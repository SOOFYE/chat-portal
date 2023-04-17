const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {cors: {origin: "*"}});
var cors = require('cors');
require('dotenv').config();
const jwt = require("jsonwebtoken")

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));


let iter = 0  
let ConnectedUsers = {} //storing sockets of users.
let UsersCurrentRoom = {}


io.on('connection',(socket)=>{
    try{

        
        
        const {USER_ID} = jwt.verify(socket.handshake.query.token,process.env.SECRET_KEY)
        if (USER_ID in ConnectedUsers && typeof ConnectedUsers[USER_ID] !== 'undefined') {
            ConnectedUsers[USER_ID].disconnect()
            UsersCurrentRoom[USER_ID] = undefined
            

            //IMPLEMENT USER LOGGING OUT EVENT STUFFF
          }
        
        ConnectedUsers[USER_ID] = socket
        socket.USER_ID = USER_ID; // Store USER_ID as a property of the socket object
        UsersCurrentRoom[USER_ID] = undefined

        console.log('[',iter,']','User Connected: ',USER_ID,'{',socket.id,'}')
        iter = iter + 1

    }catch(error){
        console.log(error)
        console.log('\n\n')
    }



    socket.on('Join-Room',(room)=>{

        if(UsersCurrentRoom.hasOwnProperty(socket.USER_ID)){
            socket.leave(UsersCurrentRoom[socket.USER_ID])
            console.log(socket.id,'LEFT ROOM: ',UsersCurrentRoom[socket.USER_ID])

        }

        socket.join(room)
        UsersCurrentRoom[socket.USER_ID]=room
        console.log(socket.id,'JOINED ROOM: ',room)

    })


    socket.on('Send-Message',(message,username,addYOUmessage)=>{
        addYOUmessage(message)
        console.log('Message SENT: ',message)

        socket.broadcast.to(UsersCurrentRoom[socket.USER_ID]).emit('Recieve-Message',message,username)
    })


    socket.on('Kick-User',UserID=>{
       
        s = ConnectedUsers[UserID]
        if(s !== undefined && s!== null){
            console.log('KICKING USER')
            s.emit('Alert-User')
        }
        else
            console.log('no user currently added')
    })





})



server.listen(8000,()=>{
    console.log('SOCKET IO SERVER LISTENING ON PORT 8000')
})