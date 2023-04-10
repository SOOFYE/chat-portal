import React, { useState, useContext, createContext, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';

import MyContext from '../src/MyContext'

import axios from 'axios';


import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";
import Sidebar from './components/Sidebar';


function App() {
  const [LOGGED_IN,setlogin] = useState(false)
  const [USER_ID,setuserid] = useState(0)
  const [USER_NAME,setuser_name] = useState('')
  const [GROUPS_JOINED,setgroupsjoined] = useState([])


  useEffect(()=>{

    axios.get("http://localhost:5000/VerifyLoggedin",{
      withCredentials: true
    })
    .then((response)=>{
      setlogin(true)
      setuserid(response.data.user_id)
      setuser_name(response.data.username)
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
    <MyContext.Provider value={{LOGGED_IN,setlogin,USER_ID,setuserid,GROUPS_JOINED,setgroupsjoined,USER_NAME,setuser_name}}>
    <Navbar/>
    <Sidebar/>
      <Routes>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Signup' element={<Signup/>}/>
      </Routes>
      </MyContext.Provider> 
    </BrowserRouter>
    
    </div>
    
  );
}

export default App;
