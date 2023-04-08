import React,{ useEffect,useRef } from 'react'



function Signup() {
    const targetRef = useRef(null)

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
    

    <div class="card w-96 glass mx-auto my-11 ">
  {/* <figure><img src="https://source.unsplash.com/6UI2zND_8AM" alt="background"/></figure> */}
  <div class="card-body">
    <h1 class="text-4xl font-black antialiased font-sans ">Sign up</h1>

    <div class="form-control w-full max-w-xs">
  <label class="label">
    <span class="label-text text-lg font-bold text-gray-700">Username</span>
    {/* <span class="label-text-alt">Top Right label</span> */}
  </label>
  <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
  <label class="label">
    {/* <span class="label-text-alt">Bottom Left label</span> */}
    <span class="label-text-alt">Bottom Right label</span>
  </label>
</div>




<div class="form-control w-full max-w-xs">
  <label class="label">
    <span class="label-text text-lg font-bold text-gray-700">Email address</span>
    {/* <span class="label-text-alt">Top Right label</span> */}
  </label>
  <input type="email" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
  <label class="label">
    {/* <span class="label-text-alt">Bottom Left label</span> */}
    <span class="label-text-alt">Bottom Right label</span>
  </label>
</div>

<div class="form-control w-full max-w-xs">
  <label class="label">
    <span class="label-text text-lg font-bold text-gray-700 ">Password</span>
    {/* <span class="label-text-alt">Top Right label</span> */}
  </label>
  <input type="password" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
  <label class="label">
    {/* <span class="label-text-alt">Bottom Left label</span> */}
    <span class="label-text-alt">Bottom Right label</span>
  </label>
</div>

<div class="form-control w-full max-w-xs">
  <label class="label">
    <span class="label-text text-lg font-bold text-gray-700">Re-Password</span>
    {/* <span class="label-text-alt">Top Right label</span> */}
  </label>
  <input type="password" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
  <label class="label">
    {/* <span class="label-text-alt">Bottom Left label</span> */}
    <span class="label-text-alt">Bottom Right label</span>
  </label>
</div>

    <div class="card-actions justify-end">
      <button class="btn btn-secondary">Sign Up</button>
    </div>
  </div>
</div>

</div>
  )
}

export default Signup