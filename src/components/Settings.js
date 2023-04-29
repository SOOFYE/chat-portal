import React, {useState, useContext} from 'react'

import axios from 'axios'
import MyContext from '../MyContext'

function Settings() {

    const [oldPassword,setold] = useState("")
    const [newPassword,setnew] = useState("")
 
    const [ERROR_OLD,setEUN] = useState("")
    const [ERROR_NEW,setEP] = useState("")

    const { USER_ID } = useContext(MyContext)

    const backStyles = {
        background: "url('https://source.unsplash.com/-rI7n2RaZ3M') no-repeat center center fixed",
        backgroundSize: 'cover',
        height: '100vh',
        backgroundPosition: 'center', // Center the image within the container
               
    }


    const handleSubmit = (e)=>{

        console.log('hellooo')

        setEP('')
        setEUN('')

        e.preventDefault();

        axios.post("http://localhost:5000/changePassword",{oldPassword,newPassword,USER_ID},{
        withCredentials: true,
      }).then((response)=>{
            setEP('Password Updated')
        })
        .catch((error)=>{
            console.log(error)
            setEUN(error.response.data)
        })



    }


  return (
    <div style={backStyles} class='py-[1px] '>
    
<form onSubmit={handleSubmit}>
    <div class="card w-96 glass mx-auto my-11 ">
  {/* <figure><img src="https://source.unsplash.com/6UI2zND_8AM" alt="background"/></figure> */}
  <div class="card-body">
    <h1 class="text-4xl font-black antialiased font-sans ">Change Password</h1>


<div class="form-control w-full max-w-xs">
  <label class="label">
    <span class="label-text text-lg font-bold text-gray-700">Old Password</span>
    {/* <span class="label-text-alt">Top Right label</span> */}
  </label>
  <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" required value={oldPassword} onChange={(e)=>setold(e.target.value)} />
  <label class="label">
    {/* <span class="label-text-alt">Bottom Left label</span> */}
    <span class="label-text-alt text-red-700">{ERROR_OLD}</span>
  </label>
</div>

<div class="form-control w-full max-w-xs">
  <label class="label">
    <span class="label-text text-lg font-bold text-gray-700 ">New Password</span>
    {/* <span class="label-text-alt">Top Right label</span> */}
  </label>
  <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" required minLength={6} value={newPassword} onChange={(e)=>setnew(e.target.value)} />
  <label class="label">
    {/* <span class="label-text-alt">Bottom Left label</span> */}
    <span class="label-text-alt text-red-700">{ERROR_NEW}</span>
  </label>
</div>



    <div class="card-actions justify-end">
      <input type='submit' class="btn btn-secondary" value='Update Password'/>
    </div>
  </div>
</div>
</form>
</div>
  )
}

export default Settings