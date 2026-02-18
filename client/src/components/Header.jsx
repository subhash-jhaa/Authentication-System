import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/Appcontext'

const Header = () => {

  const { userData } = useContext(AppContext);

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
      <div className='avatar-container relative mb-6'>
        <img src={assets.header_img} alt="" className='w-36 h-36 rounded-b-full shadow-lg border border-white/50 bg-white/20 backdrop-blur-sm' />
      </div>

      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'> Hey {userData ? userData.name : 'Developer'}!
        <img className='w-8 aspect-square ' src={assets.hand_wave} alt="" /></h1>

      <h2 className='text-3xl sm:text-5xl font-semibold mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent'>Welcome to our app</h2>

      <p className='mb-8 max-w-md text-gray-600'>Let's start with a quick product tour and we will have you up and running in no time!</p>

      <button className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-full px-10 py-3 transition-all hover:scale-105 active:scale-95 shadow-[0_4px_10px_rgba(59,130,246,0.3)]'>Get Started</button>
    </div>
  )
}

export default Header
