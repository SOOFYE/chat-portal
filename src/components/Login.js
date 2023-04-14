import React,{ useEffect,useRef, useState, useContext } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import MyContext from '../MyContext'

import { io } from "socket.io-client"

import Cookies from 'js-cookie';


function Login() {

  const navigate = useNavigate();

  const { LOGGED_IN, setlogin, setuserid, setuser_name, setsocket, setgroupsjoined } = useContext(MyContext) 

    const targetRef = useRef(null)

    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
 
    const [ERROR_username,setEUN] = useState("")
    const [ERROR_password,setEP] = useState("")

    const handleSubmit = (e)=>{


        e.preventDefault();

        const ARGS_INFO = {username,password}

        axios.post("http://localhost:5000/login",ARGS_INFO,{
        withCredentials: true,
      })
      .then((response)=>{

        const {Userid,username} = response.data

        console.log("SIGNED IN",Userid)
        setuserid(Userid)
        setuser_name(username)
        setlogin(true)

        var clientsocket = io("http://localhost:8000",{
          query:{
            token: Cookies.get('jwt')  
          }
        })
        console.log("CLIENT SOCKET CREATED: ",clientsocket)
        setsocket(clientsocket)


        // GETTING ROOMS ALREADY JOINED!!!!!
        axios.get("http://localhost:5000/GetJoinedRooms",{
          withCredentials: true
        })
        .then((response)=>{
          const { JOINED_G } = response.data
          setgroupsjoined(JOINED_G)
        }).catch((error)=>{
          console.log(error)
        })


        navigate('/home')

      })
      .catch((error)=>{
        if (error.response.status===402){
          const {ERR_MSG} = error.response.data
          setEUN(ERR_MSG)
        }
        else if (error.response.status===401){
          const {ERR_MSG} = error.response.data
          setEP(ERR_MSG)
        }
      })

    }
 




    useEffect(()=>{

        if (targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    },[])

    const backStyles = {
        background: "url('https://source.unsplash.com/V2OyJtFqEtY') no-repeat center center fixed",
        backgroundSize: 'cover',
        height: '100vh',
        backgroundPosition: 'center', // Center the image within the container
               
    }


  return (
    <div ref = {targetRef} style={backStyles} class='py-[1px] '>
    
<form onSubmit={handleSubmit}>
    <div class="card w-96 glass mx-auto my-11 ">
  {/* <figure><img src="https://source.unsplash.com/6UI2zND_8AM" alt="background"/></figure> */}
  <div class="card-body">
    <h1 class="text-4xl font-black antialiased font-sans ">Log in</h1>


<div class="form-control w-full max-w-xs">
  <label class="label">
    <span class="label-text text-lg font-bold text-gray-700">Email address or Username</span>
    {/* <span class="label-text-alt">Top Right label</span> */}
  </label>
  <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" required value={username} onChange={(e)=>setUsername(e.target.value)} />
  <label class="label">
    {/* <span class="label-text-alt">Bottom Left label</span> */}
    <span class="label-text-alt text-red-700">{ERROR_username}</span>
  </label>
</div>

<div class="form-control w-full max-w-xs">
  <label class="label">
    <span class="label-text text-lg font-bold text-gray-700 ">Password</span>
    {/* <span class="label-text-alt">Top Right label</span> */}
  </label>
  <input type="password" placeholder="Type here" class="input input-bordered w-full max-w-xs" required minLength={6} value={password} onChange={(e)=>setPassword(e.target.value)} />
  <label class="label">
    {/* <span class="label-text-alt">Bottom Left label</span> */}
    <span class="label-text-alt text-red-700">{ERROR_password}</span>
  </label>
</div>



    <div class="card-actions justify-end">
      <input type='submit' class="btn btn-secondary" value='Log in'/>
    </div>
  </div>
</div>
</form>
</div>
  )
}

export default Login