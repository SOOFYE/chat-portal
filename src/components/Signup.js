import React,{ useEffect,useRef, useState, useContext } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import MyContext from '../MyContext'

import { io } from "socket.io-client"

import Cookies from 'js-cookie';

function Signup() {

    const navigate = useNavigate();

    const targetRef = useRef(null)

    const { LOGGED_IN, setlogin, setuserid, setuser_name, setsocket } = useContext(MyContext) 


    const [username,setUsername] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [rePass,setrePass] = useState("")

    const [ERROR_username,setEUN] = useState("")
    const [ERROR_password,setEP] = useState("")
    const [ERROR_REpassword,setEREP] = useState("")
    const [ERROR_email,setEE] = useState("")
    const [ERROR_ERROR, setE_E] = useState("")



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


    const handleSubmit = (e)=>{

      setEUN('')
      setEP('')
      setEREP('')
      setEE('')
      setE_E('')

      e.preventDefault();

      if (rePass!==password){
        setEREP("Re-entered Password does not match")
        return
      }

      const ARGS_INFO = {username,email,password}

      axios.post("http://localhost:5000/signup",ARGS_INFO,{
        withCredentials: true,
      })
      .then((response)=>{

        const {Userid,username} = response.data
  
        console.log("SIGNED UP",Userid)
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

        navigate('/home')
        
      })
      .catch((error)=>{
        
        if (error.response.status===409){
          const {DUP_FIELD} = error.response.data
          if (DUP_FIELD === 'username_1'){
            setEUN("Username Already Exist!")
          }
          else if (DUP_FIELD === 'email_1'){
            setEE("Email Already Registered!")
          }
        }
        else if(error.response.status===408){
          const {ERR_MSG} = error.response.data
          setEP(ERR_MSG)
        }
        else if(error.response.status===500){
          const {ERR_MSG} = error.response.data
          setE_E(ERR_MSG)
        }

      })


    }


  return (
    <div ref = {targetRef} style={backStyles} class='py-[1px] '>
    

    <div class="card w-96 glass mx-auto my-11 ">
  {/* <figure><img src="https://source.unsplash.com/6UI2zND_8AM" alt="background"/></figure> */}
  <form onSubmit={handleSubmit}>
  <div class="card-body">
    <h1 class="text-4xl font-black antialiased font-sans ">Sign up</h1>

    <div class="form-control w-full max-w-xs">
  <label class="label">
    <span class="label-text text-lg font-bold text-gray-700">Username</span>
    {/* <span class="label-text-alt">Top Right label</span> */}
  </label>
  <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" value={username}  onChange={(e)=>setUsername(e.target.value)} required />
  <label class="label">
    {/* <span class="label-text-alt">Bottom Left label</span> */}
    <span class="label-text-alt text-red-700">{ERROR_username}</span>
  </label>
</div>




<div class="form-control w-full max-w-xs">
  <label class="label">
    <span class="label-text text-lg font-bold text-gray-700">Email address</span>
    {/* <span class="label-text-alt">Top Right label</span> */}
  </label>
  <input type="email" placeholder="Type here" class="input input-bordered w-full max-w-xs" value={email}  onChange={(e)=>setEmail(e.target.value)} required />
  <label class="label">
    {/* <span class="label-text-alt">Bottom Left label</span> */}
    <span class="label-text-alt text-red-700">{ERROR_email}</span>
  </label>
</div>

<div class="form-control w-full max-w-xs">
  <label class="label">
    <span class="label-text text-lg font-bold text-gray-700 ">Password</span>
    {/* <span class="label-text-alt">Top Right label</span> */}
  </label>
  <input type="password" placeholder="Type here" class="input input-bordered w-full max-w-xs" value={password}  onChange={(e)=>setPassword(e.target.value)} required />
  <label class="label">
    {/* <span class="label-text-alt">Bottom Left label</span> */}
    <span class="label-text-alt text-red-700">{ERROR_password}</span>
  </label>
</div>

<div class="form-control w-full max-w-xs">
  <label class="label">
    <span class="label-text text-lg font-bold text-gray-700">Re-Password</span>
    {/* <span class="label-text-alt">Top Right label</span> */}
  </label>
  <input type="password" placeholder="Type here" class="input input-bordered w-full max-w-xs" value={rePass}  onChange={(e)=>setrePass(e.target.value)} required />
  <label class="label">
    {/* <span class="label-text-alt">Bottom Left label</span> */}
    <span class="label-text-alt text-red-700">{ERROR_REpassword}</span>
  </label>
</div>

    <div class="card-actions justify-end">
      <input type='submit' class="btn btn-secondary" value='Sign Up'/>
      <span class="label-text-alt block text-red-700">{ERROR_ERROR}</span>
    </div>
  </div>
  </form>
</div>
</div>
  )
}

export default Signup