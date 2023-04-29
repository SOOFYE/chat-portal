import React, { useContext } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import MyContext from '../MyContext'

function Navbar() {

  const navigate = useNavigate()

  const { LOGGED_IN, USER_NAME, setlogin} = useContext(MyContext) 
  const {setgroupsjoined} = useContext(MyContext)

  const [CreateGroupName, setCGN] = useState('')
  const [JoinGroupName, setJGN] = useState('')
  const [ERROR_MESSAGE,seterror] = useState('')


  const CreateGroup = ()=>{

    console.log('hello')
    if(CreateGroupName!== '' && CreateGroupName!== ' '&& CreateGroupName.length>=4){

      const ARGS_INFO = {
        roomName: CreateGroupName,
        }

      axios.post("http://localhost:5000/CreateRoom",ARGS_INFO,{
        withCredentials: true,
      })
      .then((response)=>{

        console.log(response)
        setCGN('')

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
      .catch((error)=>{
        console.log(error)
      })

    }
  }

  const JoinGroup = ()=>{

    if(JoinGroupName==='' || JoinGroupName===' ' ){
      console.log('No Group name entered!')
      return
    }

    const ARGS_INFO = {
      roomID: JoinGroupName  
    }

    axios.post("http://localhost:5000/UpdateUserRoom",ARGS_INFO,{
      withCredentials: true,
    }).then((response)=>{
      console.log(response)

      axios.get("http://localhost:5000/GetJoinedRooms",{
          withCredentials: true
        })
        .then((response)=>{
          const { JOINED_G } = response.data
          setgroupsjoined(JOINED_G)
          setJGN('')
        }).catch((error)=>{
          console.log(error)
        })


    })
    .catch((error)=>{
      seterror(error.response.data.message)
      console.log(error.response.data.message)
      setTimeout(()=>{
        seterror('')
        setJGN('')
      },1500)

    })
  }



  const Logout =  ()=>{

    // Remove the "jwt" cookie by setting its value to an empty string and its expiration date to a past date
  document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  console.log('NESIASD')
  setlogin(false)
  navigate('/login')

  }

  return (
    <div class="navbar border-b  bg-base-400">

    <div class="flex-1">
      <Link to='/home'><button class="btn btn-ghost normal-case text-xl mr-[90px]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
</svg>
ChatVerse</button></Link>

{LOGGED_IN ? (<div>
{/* JOIN GROUP */}
<label for="my-modal" className="group relative inline-flex items-center overflow-hidden rounded bg-indigo-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500"><span class="absolute -start-full transition-all group-hover:start-4"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-1 w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
</svg></span>

<span class="text-sm font-medium transition-all group-hover:ms-4">
    Join a Server
  </span></label>

<input type="checkbox" id="my-modal" class="modal-toggle" />
<div class="modal">
  <div class="modal-box">
    {/* <h3 class="font-bold text-lg">Enter Group ID to join:</h3> */}
    <label
  for="JoinGroup"
  class="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
>
  <span class="text-xs font-medium text-gray-700"> Enter Server ID to join </span>

  <input
    type="text"
    id="JoinGroup"
    placeholder="agdua56dj12631j2gjh1t2ju3t12jhg12"
    class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
    value={JoinGroupName} onChange={(e)=>{setJGN(e.target.value)}}
  />
  
</label>
<p className='my-2 font-medium text-lg text-red-700'>{ERROR_MESSAGE}</p>
    
    {/* <div class="form-control">
  <div class="input-group block mt-2">
    <input type="text" placeholder="Group ID" class="input input-bordered" value={JoinGroupName} onChange={(e)=>{setJGN(e.target.value)}} />
  </div>
</div> */}
    <div class="modal-action">
    {/* <button  onClick={JoinGroup} for="my-modal" class="btn">Join!</button> */}
    <button onClick={JoinGroup} for="my-modal"
  class="group relative inline-block text-sm font-medium text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
>
  <span
    class="absolute inset-0 translate-x-0 translate-y-0 bg-indigo-600 transition-transform group-hover:translate-y-0.5 group-hover:translate-x-0.5"
  ></span>

  <span class="relative block border border-current bg-white px-8 py-3">
    Join this Server
  </span>
</button>
    {/* <label for="my-modal" class="btn btn-error">Close</label> */}
    <label for="my-modal"
  class="group relative inline-block text-sm font-medium text-red-600 focus:outline-none focus:ring active:text-indigo-500"
  
>
  <span
    class="absolute inset-0 translate-x-0 translate-y-0 bg-red-600 transition-transform group-hover:translate-y-0.5 group-hover:translate-x-0.5"
  ></span>

  <span class="relative block border border-current bg-white px-8 py-3">
    Close
  </span>
</label>
    </div>
  </div>
</div>

{/* CREATE GROUP */}
<label for="my-modal_1" className="mx-2 group relative inline-flex items-center overflow-hidden rounded bg-indigo-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500"><span class="absolute -start-full transition-all group-hover:start-4"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-1">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg></span>
<span class="text-sm font-medium transition-all group-hover:ms-4">
    Create a Server
  </span></label>

<input type="checkbox" id="my-modal_1" class="modal-toggle" />
<div class="modal">
  <div class="modal-box">
    {/* <h3 class="font-bold text-lg">Enter Group Name:</h3> */}
    <label
  for="ServerName"
  class="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
>
  <span class="text-xs font-medium text-gray-700"> Enter your server name </span>

  <input
    type="text"
    id="ServerName"
    placeholder="Server Name"
    class="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
    value={CreateGroupName} onChange={(e)=>{setCGN(e.target.value)}}
  />
</label>
    {/* <div class="form-control">
  <div class="input-group block mt-2">
    <input type="text" placeholder="Group Name" class="input input-bordered" value={CreateGroupName} onChange={(e)=>{setCGN(e.target.value)}}/>
  </div>
</div> */}
    <div class="modal-action">
      {/* <button  onClick={CreateGroup} for="my-modal_1" class="btn">Create!</button> */}
      <button onClick={CreateGroup} for="my-modal"
  class="group relative inline-block text-sm font-medium text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
>
  <span
    class="absolute inset-0 translate-x-0 translate-y-0 bg-indigo-600 transition-transform group-hover:translate-y-0.5 group-hover:translate-x-0.5"
  ></span>

  <span class="relative block border border-current bg-white px-8 py-3">
    Create your server
  </span>
</button>
      {/* <label for="my-modal_1" class="btn btn-error">Close</label> */}
      <label for="my-modal_1"
  class="group relative inline-block text-sm font-medium text-red-600 focus:outline-none focus:ring active:text-indigo-500"
  
>
  <span
    class="absolute inset-0 translate-x-0 translate-y-0 bg-red-600 transition-transform group-hover:translate-y-0.5 group-hover:translate-x-0.5"
  ></span>

  <span class="relative block border border-current bg-white px-8 py-3">
    Close
  </span>
</label>
    </div>
  </div>
</div></div>):(<div></div>)

}



    </div>

    

{!LOGGED_IN ? (
    <div class="flex-none gap-3 mx-4">
        <Link to='/Signup'><button className="inline-block rounded bg-indigo-600 px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500">Sign up</button></Link>
        <Link to='/Login'><button  className="inline-block rounded border border-current px-8 py-3 text-sm font-medium text-indigo-600 transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:text-indigo-500">Login</button></Link>
    </div>
)

: (<div class="flex-none gap-2">
      <div class="form-control">
        <input type="text" placeholder="Search" class="input input-bordered" />
      </div>
      <h3>Welcome, {USER_NAME}</h3>
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
          <img src="https://source.unsplash.com/8eYI8qcEFxI" />
          </div>
        </label>
        <ul tabindex="0" class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
          {/* <li>
            <a class="justify-between">
              Profile
              <span class="badge">New</span>
            </a>
          </li> */}
          <li><Link to='/Setting'>Settings</Link></li>
          <li><button onClick={()=>{Logout()}}>Logout</button></li>
        </ul>
      </div>
    </div>)
}




  </div>
  )
}

export default Navbar