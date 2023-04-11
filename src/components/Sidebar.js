import React, {useContext} from 'react'
import MyContext from '../MyContext'
import ChatPortal from './ChatPortal';

function Sidebar() {

  const { GROUPS_JOINED,USER_ID } = useContext(MyContext)
  


  return (
    <div class="flex ">

    <div class="flex-initial w-[500px] drawer drawer-mobile">
  
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex mx-10 my-10 items-left ">
      
      <label for="my-drawer-2" class="btn btn-primary  drawer-button lg:hidden">Open drawer</label>
    
    </div>
     
    <div class="drawer-side">
    
      <label for="my-drawer-2" class="drawer-overlay"></label> 
      
      <ul class="menu p-0 w-80 bg-gray-50 text-base-content ">
        <h1 class=" p-4 w-80 bg-gray-50 text-base-content text-2xl font-black ">Joined Groups</h1>
        
        {GROUPS_JOINED.length > 0 ? GROUPS_JOINED.slice(0).reverse().map((group, index) => {
          return (
            <li className='hover:bg-gray-200 h-12  border-b-2 relative' key={index}>
              <p class='font-bold text-lg'>{group.name}</p>
              
              <span className="absolute top-0 right-0 mt-1 mr-1">
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
