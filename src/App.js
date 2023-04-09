import React, { useState, useContext, createContext } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';

import MyContext from '../src/MyContext'



import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";


function App() {
  const [LOGGED_IN,setlogin] = useState(false)
  const [USER_ID,setuserid] = useState(0)


  return (
    
    <div className="App">
    
    <BrowserRouter>
    <MyContext.Provider value={{LOGGED_IN,setlogin,USER_ID,setuserid}}>
    <Navbar/>
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
