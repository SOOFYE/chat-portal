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
        background: "url('https://source.unsplash.com/kUHfMW8awpE') no-repeat center center fixed",
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
    <h1 class="text-2xl font-black antialiased font-sans mb-3 text-black dark:text-black">Lets Sign up...</h1>

    <div class="form-control w-full max-w-xs mb-5">

  {/* <label class="label">
    <span class="label-text text-lg font-bold text-gray-700">Username</span>
    <span class="label-text-alt">Top Right label</span> 
  </label>
  <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" value={username}  onChange={(e)=>setUsername(e.target.value)} required />
  <label class="label">
     <span class="label-text-alt">Bottom Left label</span> 
    <span class="label-text-alt text-red-700">{ERROR_username}</span>
  </label> */}

  <label
  for="username"
  class="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
>
  <span class="text-xs font-medium text-gray-700"> Username </span>

  <input
    type="text"
    id="username"
    placeholder="Username"
    class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
    value={username}  
    onChange={(e)=>setUsername(e.target.value)} 
    required


  />
</label>
<span class="label-text-alt text-red-700">{ERROR_username}</span>

</div>




<div class="form-control w-full max-w-xs mb-5">

  {/* <label class="label">
    <span class="label-text text-lg font-bold text-gray-700">Email address</span>
     <span class="label-text-alt">Top Right label</span> 
  </label>
  <input type="email" placeholder="Type here" class="input input-bordered w-full max-w-xs" value={email}  onChange={(e)=>setEmail(e.target.value)} required />
  <label class="label">
     <span class="label-text-alt">Bottom Left label</span> 
    <span class="label-text-alt text-red-700">{ERROR_email}</span>
  </label> */}

  <label
  for="emailaddress"
  class="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
>
  <span class="text-xs font-medium text-gray-700"> Email Address </span>

  <input
    type="email"
    id="emailaddress"
    placeholder="Email Address"
    class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
    value={email}  
    onChange={(e)=>setEmail(e.target.value)} 
    required
  />
</label>
<span class="label-text-alt text-red-700">{ERROR_email}</span>
</div>

<div class="form-control w-full max-w-xs mb-5">

  {/* <label class="label">
    <span class="label-text text-lg font-bold text-gray-700 ">Password</span>
     <span class="label-text-alt">Top Right label</span> 
  </label>
  <input type="password" placeholder="Type here" class="input input-bordered w-full max-w-xs" value={password}  onChange={(e)=>setPassword(e.target.value)} required />
  <label class="label">
     <span class="label-text-alt">Bottom Left label</span> 
    <span class="label-text-alt text-red-700">{ERROR_password}</span>
  </label> */}

  <label
  for="pass"
  class="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
>
  <span class="text-xs font-medium text-gray-700"> Password </span>

  <input
    type="password"
    id="pass"
    placeholder="Password"
    class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
    value={password}  
    onChange={(e)=>setPassword(e.target.value)} 
    required
  />
</label>
  <span class="label-text-alt text-red-700">{ERROR_password}</span>
</div>

<div class="form-control w-full max-w-xs mb-5">

  {/* <label class="label">
    <span class="label-text text-lg font-bold text-gray-700">Re-Password</span>
     <span class="label-text-alt">Top Right label</span> 
  </label>
  <input type="password" placeholder="Type here" class="input input-bordered w-full max-w-xs" value={rePass}  onChange={(e)=>setrePass(e.target.value)} required />
  <label class="label">
     <span class="label-text-alt">Bottom Left label</span> 
    
  </label> */}

  <label
  for="repass"
  class="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
>
  <span class="text-xs font-medium text-gray-700"> Re-Password </span>

  <input
    type="password"
    id="repass"
    placeholder="Re-Password"
    class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
    value={rePass}  
    onChange={(e)=>setrePass(e.target.value)} 
    required
  />
</label>
<span class="label-text-alt text-red-700">{ERROR_REpassword}</span>
</div>

    <div class="card-actions justify-end">
      {/* <input type='submit' class="btn btn-secondary" value='Sign Up'/> */}
      <button type='submit'
      class="group relative inline-flex items-center overflow-hidden rounded bg-indigo-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500"
  
>
  <span class="absolute -end-full transition-all group-hover:end-4">
    <svg
      class="h-5 w-5 rtl:rotate-180"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  </span>

  <span class="text-sm font-medium transition-all group-hover:me-4">
    Sign up
  </span>
</button>
      <span class="label-text-alt block text-red-700">{ERROR_ERROR}</span>
    </div>
  </div>
  </form>
</div>
</div>
  )
}

export default Signup