import React, { useEffect, useState } from 'react'
import axios from 'axios';

import {
    BrowserRouter as Router,
    useParams,
    useNavigate
  } from "react-router-dom";

function JoinGroupRedrct() {

    const [Ms,setms] = useState('Verifying!')
    const { roomid } = useParams();
    const navigate = useNavigate()


    useEffect(()=>{

        if(roomid==='' || roomid===' ' ){
            return
          }
      
          const ARGS_INFO = {
            roomID: roomid  
          }
      
          axios.post("http://localhost:5000/UpdateUserRoom",ARGS_INFO,{
            withCredentials: true,
          }).then((response)=>{
            console.log(response)
            setms('Group Joined!')
            setTimeout(() => {
                setms('Redirecting...')
            }, 1500);
            setTimeout(() => {
                navigate('/home')
            }, 2000);
      
      
          })
          .catch((error)=>{
            if(error.response.data==='User is already a member of the room!'){
                setms('You are Already Joined!')
                setTimeout(() => {
                    setms('Redirecting...')
                }, 1500);
                setTimeout(() => {
                    navigate('/home')
                }, 2000);
            }
            else if(error.response.data==='Room doesnt Exist!'){
                setms('Group Does not Exist')
                setTimeout(() => {
                    setms('Redirecting...')
                }, 1500);
                setTimeout(() => {
                    navigate('/home')
                }, 2000);

            }
            else{
                setms('Internal Error')
                setTimeout(() => {
                    setms('Redirecting...')
                }, 1500);
                setTimeout(() => {
                    navigate('/home')
                }, 2000);

            }
            console.log(error)
            
      
          })



    },[])


  return (
    <div>
    <h1 className='font-black text-4xl my-10'>{Ms}</h1>
    <progress class="progress w-56"></progress>
    </div>
  )
}

export default JoinGroupRedrct