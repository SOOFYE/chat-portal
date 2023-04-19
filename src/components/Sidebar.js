import React, {useContext, useEffect} from 'react'
import MyContext from '../MyContext'
import ChatPortal from './ChatPortal';
import { useNavigate } from "react-router-dom";

import axios from 'axios';

function Sidebar() {

  const navigate = useNavigate();

  const { LOGGED_IN, GROUPS_JOINED,USER_ID, SOCKET, setroomjoined, 
    setroomname, setlogin, setgroupadmin, setgroupdetails,
    setloadmessages, setgroupsjoined, setalert } = useContext(MyContext)
  

  const handleDownload = (filename)=>{
    axios.get('http://localhost:5000/DownloadFile'+`/${filename}`)
    .then(()=>{
      console.log('FILE DOWNLOADED')

      setalert(<div class="alert alert-success shadow-lg">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Downloaded File successfully in your Downloads Directory</span>
      </div>
    </div>)

    setTimeout(() => {
      setalert('')
    }, 3000);

    }

      )
      .catch((error)=>{
        console.log(error)

        setalert(<div class="alert alert-error shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Error! Download failed</span>
        </div>
      </div>)

    setTimeout(() => {
      setalert('')
    }, 2000);



      
      })

   


  }  




  const JOIN_ROOM = (ROOM_ID,ROOM_NAME,GROUP_ADM)=>{

    setloadmessages([])
    
    SOCKET.emit('Join-Room',ROOM_ID)
    setroomjoined(ROOM_ID)
    setroomname(ROOM_NAME)
    setgroupadmin(GROUP_ADM)
    console.log('ROOM JOINED: ',ROOM_ID)

    const ARGS_INFO = {CURRENT_ROOM_JOINED:ROOM_ID}

    axios.post("http://localhost:5000/GetALLGROUPDETAILS",ARGS_INFO,{ //get all group emmebers, group admin info and all.
      withCredentials: true,
    }).then((response)=>{
      console.log('Got group details!: ',response)
      setgroupdetails(response.data.USER_DETAILS)
    }).catch((error)=>{
      console.log(error)
    })


    //GET GROUP MESSAGES SAVED!!!!!

    axios.get("http://localhost:5000/GetGroupMessages"+`/${ROOM_ID}`)
    .then((response) => {
      console.log('Got Groyp Messages: ',response)
      if(response.data!==null){
        let newMessages = [];
        response.data.map((messages)=>{
          if(messages.sender._id===USER_ID){
            newMessages.push(
              <div key ={messages._id} class="chat chat-end ml-auto mr-12">
                <div class="chat-image avatar">
                  <div class="w-10 rounded-full">
                    <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                  </div>
                </div>
                <div class="chat-header">
                  You
                </div>
                {messages.isFile ? (<div class="chat-bubble chat-bubble-success font-medium "><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
</svg>
{messages.message}</div>):(<div class="chat-bubble bg-blue-800 font-medium ">{messages.message}</div>)}
                
                
              </div>
            );
          } else{
            newMessages.push(
              <div key ={messages._id} class="chat chat-start">
                <div class="chat-image avatar">
                  <div class="w-10 rounded-full">
                    <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                  </div>
                </div>
                <div class="chat-header">
                  {messages.sender.username}
                </div>
                <div class="chat-bubble font-medium inline">{messages.message} {messages.isFile ? (<button onClick={()=>handleDownload(messages.message)} className='tooltip mx-1 inline' data-tip="Download file"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>
</button>):(<div></div>)}</div>
               
              </div>
            );
          }
        });
        setloadmessages(prevMessages => prevMessages.concat(newMessages));
      }
    })
    .catch((error)=>{
      console.log(error)
    });


  }





  const refreshGroup = ()=>{
    
    axios.get("http://localhost:5000/GetJoinedRooms",{
      withCredentials: true
    })
    .then((response)=>{
      const { JOINED_G } = response.data
      setgroupsjoined(JOINED_G)
    }).catch((error)=>{
      console.log(error)
    })


  }






  useEffect(()=>{

    axios.get("http://localhost:5000/VerifyLoggedin",{
      withCredentials: true
    })
    .then(()=>{
      console.log('logged in')

    })
    .catch((error)=>{
      setlogin(false)
      navigate('/Login')
    })

  },[LOGGED_IN])

  return (
    <div class="flex  ">

    <div class="flex-initial w-[350px] h-screen drawer drawer-mobile ">
  
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex mx-10 my-10 items-left ">
      
      <label for="my-drawer-2" class="btn btn-primary  drawer-button lg:hidden">Open drawer</label>
    
    </div>
     
    <div class="drawer-side">
    
      <label for="my-drawer-2" class="drawer-overlay"></label> 
      
      <ul class="menu p-0 w-80 bg-gray-50 text-base-content border-r ">
        <h1 class=" p-4 w-80 bg-gray-50 border-r  text-base-content text-2xl font-black ">Joined Groups <button onClick={()=>refreshGroup()}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="inline w-4 h-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg></button></h1>
        
        {GROUPS_JOINED.length > 0 ? GROUPS_JOINED.slice(0).reverse().map((group, index) => {
          return (
            <li onClick={()=>{JOIN_ROOM(group._id,group.name,group.admin)}} className='hover:bg-gray-200 h-12  border-b-2 relative' key={index}>
              <p class='font-bold text-lg'>{group.name}</p>
              
              <span  className="absolute top-0 right-0 mt-1 mr-1 pointer-events-none ">
                <span  className=" whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-sm text-purple-700">
                  {group.admin === USER_ID ? 'ADMIN' : 'MEMBER'}
                </span>
              </span>
              
            </li>
          );
        }) : (
          <div>
            <h3>No groups joined/created yet...</h3>
          </div>
        )}
        
        {/*      
        <li class='hover:bg-pink-100'><a>Sidebar Item 1</a></li>
        <li><a>Sidebar Item 2</a></li> */}
      </ul> 
    </div>
    
  </div>
  
  <div className='flex-auto w-64 mt-10 '>
  <ChatPortal/>
  </div>
   
  
  
</div>
  )
}

export default Sidebar
