import React, { useState, useContext, createContext, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';

import MyContext from '../src/MyContext'

import axios from 'axios';

import { io } from 'socket.io-client'

import Cookies from 'js-cookie';




import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";
import Sidebar from './components/Sidebar';
import ChatPortal from './components/ChatPortal';
import JoinGroupRedrct from './components/JoinGroupRedrct';
import Settings from './components/Settings';
import Footer from './components/Footer';


function App() {
  const [LOGGED_IN,setlogin] = useState(false)
  const [USER_ID,setuserid] = useState(0)
  const [USER_NAME,setuser_name] = useState('')
  const [GROUPS_JOINED,setgroupsjoined] = useState([])
  const [SOCKET,setsocket] = useState(io())
  const [CURRENT_ROOM_JOINED, setroomjoined] = useState('') //id
  const [ROOM_NAME,setroomname] = useState('')
  const [GROUP_ADMIN,setgroupadmin] = useState('')
  const [LOAD_MESSAGES,setloadmessages] = useState([])


  const [GROUP_DETAILS,setgroupdetails] = useState([])

  const [ALERT,setalert] = useState('')




  SOCKET.on('Alert-User',()=>{
    console.log('ALERTED USER')
    setroomjoined('')
    setroomname('')

    axios.get("http://localhost:5000/GetJoinedRooms",{
      withCredentials: true
    })
    .then((response)=>{
      const { JOINED_G } = response.data
      setgroupsjoined(JOINED_G)
    }).catch((error)=>{
      console.log(error)
    })

  })

  

  useEffect(()=>{

    axios.get("http://localhost:5000/VerifyLoggedin",{
      withCredentials: true
    })
    .then((response)=>{
      setlogin(true)
      setuserid(response.data.user_id)
      setuser_name(response.data.username)

      var clientsocket = io("http://localhost:8000",{
        query:{
          token: Cookies.get('jwt')  
        }
      })

      console.log("CLIENT SOCKET CREATED: ",clientsocket)
      setsocket(clientsocket)



    })
    .catch((error)=>{
      setlogin(false)
    })

    axios.get("http://localhost:5000/GetJoinedRooms",{
      withCredentials: true
    })
    .then((response)=>{
      const { JOINED_G } = response.data
      setgroupsjoined(JOINED_G)
    }).catch((error)=>{
      console.log(error)
    })

  },[])


  return (
    
    <div className="App">
    
    <BrowserRouter>
    <MyContext.Provider value={{LOGGED_IN,setlogin,USER_ID,setuserid,GROUPS_JOINED,setgroupsjoined,USER_NAME,setuser_name,
    SOCKET,setsocket,CURRENT_ROOM_JOINED,setroomjoined,ROOM_NAME,setroomname,GROUP_ADMIN,setgroupadmin,GROUP_DETAILS,setgroupdetails
    ,LOAD_MESSAGES,setloadmessages,ALERT,setalert}}>
    <Navbar/>
      <Routes>
      <Route path="/" element={<Navigate to="/home" replace={true} />}></Route>
        <Route path='/home' element={<Sidebar/>}/>
        <Route path='/JoinGroup/:roomid' element={<JoinGroupRedrct/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Signup' element={<Signup/>}/>
        <Route path='/Setting' element={<Settings/>}/>
      </Routes>
      <Footer/>
      </MyContext.Provider> 
    </BrowserRouter>
    
    </div>
    
  );
}

export default App;
