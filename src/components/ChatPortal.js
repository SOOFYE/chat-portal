import React, { useContext, useEffect, useState, useRef } from 'react'
import MyContext from '../MyContext'
import axios from 'axios'

function ChatPortal() {

  const {SOCKET,USER_NAME,ROOM_NAME, USER_ID, GROUP_ADMIN, CURRENT_ROOM_JOINED, GROUP_DETAILS,LOAD_MESSAGES,setloadmessages, setgroupdetails,ALERT,setalert} = useContext(MyContext)
  const [Message,setmessage] = useState('')

 

  

  const [adduser,setadduser] = useState('')

  const [addingERROR,setADDERROR] = useState('')
  const [addingACCEPT,setACCEPT] = useState('')

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  //const [groupDetails,setdetails] = useState('')

  const chatBox = useRef(null);

 


  const Send_Message = (isfile,fileName)=>{

    let MESSSAGE = ''

    if(isfile===true){
      MESSSAGE = fileName
      console.log('********',fileName)
       SOCKET.emit('Send-Message',fileName,isfile,USER_NAME,addYOUmessage)
    }else{
      MESSSAGE = Message
      SOCKET.emit('Send-Message',Message,isfile,USER_NAME,addYOUmessage)
    }

    

    const ARGS_INFO = {
      USER_ID: USER_ID,
      MESSAGE: MESSSAGE,
      ROOM_ID: CURRENT_ROOM_JOINED,
      isFile: isfile
    }

    console.log('MSESADSADSAD')
    axios.post("http://localhost:5000/SaveGroupMessages",ARGS_INFO,{
        withCredentials: true,
      }).then((response)=>{
        console.log('SAVED MESSAGES: ',response)

      }).catch((error)=>{
        console.log(error)
      })



  }

  SOCKET.on('Recieve-Message',(message,isfile,username)=>{

    setloadmessages(
      LOAD_MESSAGES.concat(
        <div key ={LOAD_MESSAGES.length} class="chat chat-start">
        <div class="chat-image avatar">
          <div class="w-10 rounded-full">
            <img src="https://source.unsplash.com/8eYI8qcEFxI" />
          </div>
        </div>
        <div class="chat-header">
          {username}
          {/* <time class="text-xs opacity-50">12:45</time> */}
        </div>
        <div class="chat-bubble font-medium inline">{message} {isfile ? (<button onClick={()=>handleDownload(message)} className='tooltip mx-1 inline' data-tip="Download file"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>
</button>):(<div></div>)}</div>
      </div>

      )
    )

  })

  const addYOUmessage = (message,isfile)=>{
    setloadmessages(
      LOAD_MESSAGES.concat(
            <div key ={LOAD_MESSAGES.length} class="chat chat-end ml-auto mr-12 ">
        <div class="chat-image avatar">
          <div class="w-10 rounded-full">
            <img src="https://source.unsplash.com/8eYI8qcEFxI" />
          </div>
        </div>
        <div class="chat-header">
          You
          {/* <time class="text-xs opacity-50">12:46</time> */}
        </div>
        {isfile ? (<div class="chat-bubble chat-bubble-success font-medium "><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
</svg>
{message}</div>):(<div class="chat-bubble bg-blue-800 font-medium ">{message}</div>)}
        {/* <div class="chat-footer opacity-50">
          Seen at 12:46
        </div> */}
      </div>
      )
    );

    setmessage('')

    // setTimeout(()=>{
    //   chatBox.current.scrollIntoView({ behavior: "smooth" ,alignToTop:true})

    // },150)

  }

  const handleAddUser = ()=>{

    const ARGS_INFO = {adduser,CURRENT_ROOM_JOINED}

    console.log(ARGS_INFO)

      axios.post("http://localhost:5000/AddUserInGroup",ARGS_INFO,{
        withCredentials: true,
      })
      .then((response)=>{
        console.log(response)
        setACCEPT(response.data)


        axios.post("http://localhost:5000/GetALLGROUPDETAILS",ARGS_INFO,{ //get all group emmebers, group admin info and all.
      withCredentials: true,
    }).then((response)=>{
      console.log('Got group details!: ',response)
      setgroupdetails(response.data.USER_DETAILS)
    }).catch((error)=>{
      console.log(error)
    })





        setTimeout(()=>{
          setACCEPT('')
          setadduser('')
        },2000)
        
      }).catch((error)=>{
        console.log(error)
        setADDERROR(error.response.data)

        setTimeout(()=>{
          setADDERROR('')
          setadduser('')
        },2000)
      })

  }


  const handleKick = (useriddd)=>{

    const ARGS_INFO = {
      USER_ID: useriddd,
      GROUP_ID: CURRENT_ROOM_JOINED

    }

    axios.post("http://localhost:5000/KickUser",ARGS_INFO,{
        withCredentials: true,
      }).then((response)=>{
        console.log(response)

        axios.post("http://localhost:5000/GetALLGROUPDETAILS",{CURRENT_ROOM_JOINED},{ //get all group emmebers, group admin info and all.
        withCredentials: true,
      }).then((response)=>{
        console.log('Got group details!: ',response)
        setgroupdetails(response.data.USER_DETAILS)
      }).catch((error)=>{
        console.log(error)
      })

        SOCKET.emit('Kick-User',useriddd)

      }).catch((error)=>{
        console.log(error)
      })



  }

  const handleFileInput = (e)=>{
    setSelectedFile(e.target.files[0]);
    
    setFileName(e.target.files[0].name);

    console.log(e.target.files[0])

    
    const formData = new FormData();
    formData.append("file",e.target.files[0]);
  
    // Log the FormData object after a delay of 500ms
    setTimeout(() => {
      console.log(Object.fromEntries(formData));

      axios
      .post("http://localhost:5000/UploadFile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);

        Send_Message(true,response.data)



      })
      .catch((error) => {
        console.log(error);
        setalert(<div class="alert alert-error shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Error! Upload Failed</span>
        </div>
      </div>)

    setTimeout(() => {
      setalert('')
    }, 2000);
      });


    }, 2000);
  };
    

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



  




  useEffect(()=>{

    if(CURRENT_ROOM_JOINED)
      // setTimeout(() => {
      //   chatBox.current.scrollIntoView({ behavior: "smooth" ,alignToTop:true})
      // }, 150);
      console.log(CURRENT_ROOM_JOINED)
      
      

  },[CURRENT_ROOM_JOINED])



  return CURRENT_ROOM_JOINED ? (

    
    <div className='h-screen overflow-y-clip'>
    <div>{ALERT}</div>

<div class='flex items-center bg-gray-50 border'>
  <h1 class='ml-1 inline-flex text-3xl font-black  p-2  '>{ROOM_NAME}</h1><button onClick={()=>{navigator.clipboard.writeText(`http://localhost:3000/JoinGroup/${CURRENT_ROOM_JOINED}`);}} className='tooltip tooltip-bottom inline mt-1' data-tip="Copy Group URL" ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
</svg>
</button>
  <div className='ml-auto inline-flex'>
  {/* <button className='mr-5 text-medium font-extralight text-red-500 '><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 inline mb-1">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
</svg>
Leave</button> */}
  {GROUP_ADMIN === USER_ID ? (<div className='mr-5'>
<label for="my-modal-3" class="hover:cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
</svg>
</label>

<input type="checkbox" id="my-modal-3" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <h3 class="text-lg font-bold mb-4">Add Users!</h3>
    
    
      <div
        class="flex bg-gray-100 p-1 items-center w-full space-x-2 sm:space-x- rounded border border-gray-500 dark:bg-gray-700 dark:border-gray-300">
        <button onClick={handleAddUser}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>

        </button>
        <input value={adduser} onChange={(e)=>{setadduser(e.target.value)}} class="bg-gray-100 outline-none text-sm sm:text-base w-full dark:bg-gray-700 dark:text-gray-200 border-transparent focus:border-transparent focus:ring-0" type="text"
          placeholder="Add Username..." />
          <p className='font-black text-red-700 text-sm'>{addingERROR}</p>
          <p className='font-black text-green-700 text-sm'>{addingACCEPT}</p>
      </div>
    

    


  </div>
</div>
</div> ) : (<div></div>)
  
  }

{/* VIEW MEMEBERS */}
<label for="my-modal-33" class="hover:cursor-pointer mr-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
</svg></label>


<input type="checkbox" id="my-modal-33" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label for="my-modal-33" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <h3 class="text-lg font-bold">Members</h3>
    <div className="overflow-x-auto w-full">
  <table className="table w-full">
    {/* head */}
    <thead>
      <tr>
        <th>Name</th>
        <th>Privilege</th>
        <th></th>
      </tr>
    </thead>
    

    {/* row admin */}

    


      {/* row 1 */}
      
       
      {GROUP_DETAILS && GROUP_DETAILS.admin ? (
  <tbody>
    <tr>
      <td>
        <div key={GROUP_DETAILS.admin._id} className="flex items-center space-x-3">
          <div className="avatar">
            <div className="mask mask-squircle w-12 h-12">
              <img src="https://source.unsplash.com/8eYI8qcEFxI" alt="Avatar Tailwind CSS Component" />
            </div>
          </div>
          <div>
            <div className="font-bold">{GROUP_DETAILS.admin.username}</div>
            <div className="text-sm opacity-50">{GROUP_DETAILS.admin._id}</div>
          </div>
        </div>
      </td>
          
      <td>
        <span className="badge badge-ghost badge-sm">Admin</span>
      </td>        
    </tr>
    
    {GROUP_DETAILS.members.map((item,index)=>{
      return (
        <tr key={item._id}>
          <td>
            <div className="flex items-center space-x-3">
              <div className="avatar">
                <div className="mask mask-squircle w-12 h-12">
                  <img src="https://source.unsplash.com/8eYI8qcEFxI" alt="Avatar Tailwind CSS Component" />
                </div>
              </div>
              <div>
                <div className="font-bold">{item.username}</div>
                <div className="text-sm opacity-50">{item._id}</div>
              </div>
            </div>
          </td>
          
          <td>
            <span className="badge badge-ghost badge-sm">Member</span>
          </td>        
        
          {GROUP_DETAILS.admin._id===USER_ID?(<th>
            <button onClick={()=>handleKick(item._id)} className="btn btn-ghost btn-xs hover:text-red-600">Kick</button>
          </th>):(<th></th>)}
        </tr> 
      )
    })}
  </tbody>
) : (
  <div>Loading...</div>
)}




    
  </table>
</div>
  </div>
</div>


  {/* <button className='mr-5'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
</svg>
</button> */}

</div>
 
</div>

    
<div 
        style={{
          marginLeft: "15%",
          marginTop: "2%",
          display: "flex",
          overflowY: "auto",
          height: "420px",
          

        }}
       
      >

    <div className='container '>{LOAD_MESSAGES}
    <div  ref={chatBox} />
    </div>

    </div>
    
  

<div class="flex items-center relative mx-12 my-[120px]">
  <input value={Message} onChange={(e)=>{setmessage(e.target.value)}} type="text" placeholder="Type your message here..." class="w-full px-8 py-3 rounded-full bg-gray-200 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:placeholder-gray-400"/>
  <button 
    onClick={()=>Send_Message(false,undefined)} 
    className={Message !== '' && Message !== ' ' ? "absolute right-4 top-1/2 transform -translate-y-1/2 mr-3 text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800 px-4 py-2" : "absolute right-4 top-1/2 transform -translate-y-1/2 mr-3 text-gray-600 focus:outline-none focus:text-gray-800 opacity-40 cursor-not-allowed  text-gray-600 py-2 px-4"}
    disabled={Message === '' || Message === ' '}
>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hover:text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
</button>
 

<label htmlFor="file-input" className="cursor-pointer absolute -right-5 top-1/2 transform -translate-y-1/2 mr-3 text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800 px-4 py-2">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
</svg>
  <input
    id="file-input"
    type="file"
    className="sr-only"
    onChange={handleFileInput}
    //disabled={file !== null}
  />
</label>


</div>


</div>
  
  ):(<div className='text-4xl font-bold mt-12'>Enter/Join a Group to start chatting...</div>)
}

export default ChatPortal