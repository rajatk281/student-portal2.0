import React from 'react'
import Spline from '@splinetool/react-spline/next';

const page = () => {
  return (
    <div className='h-screen relative
    '>
      <Spline
        scene="https://prod.spline.design/nNegvrD05qJqxbqk/scene.splinecode"
      />
      <div className='absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 
                flex gap-8 justify-center items-center w-full'>

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
    </div>
  )
}

export default page