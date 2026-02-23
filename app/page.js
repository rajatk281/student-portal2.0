import React from 'react'
import Spline from '@splinetool/react-spline/next';

const page = () => {
  return (
    <div className='h-screen relative fit-content overflow-hidden
    '>
      <Spline 
        scene="https://prod.spline.design/nNegvrD05qJqxbqk/scene.splinecode"
      />
      <div className='absolute top-4/5 left-1/2 -translate-x-1/2 -translate-y-1/2 
                flex gap-8 justify-center items-center w-full '>

        <button className='cursor-pointer px-10 py-3 rounded-full bg-white text-black font-semibold 
                     hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] 
                     transition-all active:scale-95'>
          Student
        </button>

        <button className='cursor-pointer px-10 py-3 rounded-full border border-white/30 text-white 
                     font-medium backdrop-blur-sm hover:bg-white/10 
                     hover:border-white transition-all active:scale-95'>
          Educator
        </button>

      </div>
      <div className='absolute bg-black text-white/60 bottom-5 text-sm right-4 font-extralight px-3 py-2 rounded-2xl'>
        Crafted for Modern Education
      </div>
      <div className=" max-sm:block hidden absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg 
                flex-col justify-center items-center px-6 py-28
                bg-neutral-900/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center">
  
  <div className="absolute w-32 bg-blue-500/20 blur-[60px] rounded-full" />

  <h1 className="text-5xl md:text-5xl font-bold tracking-tight leading-[1.1] text-white">
    Study <span className="text-blue-400">Smart.</span><br />
    Track <span className="text-neutral-400">Better.</span><br />
    <span className="bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
      Achieve More
    </span>
  </h1>
  
  <p className="mt-4 text-neutral-400 text-sm font-medium tracking-wide uppercase">
    Powered by AI Intelligence
  </p>
</div>
<div className='top-0 absolute p-4 text-2xl font-bold'>
  NEXORA
</div>
    </div>
  )
}

export default page