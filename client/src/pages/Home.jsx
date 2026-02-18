import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-grid relative overflow-hidden'>
      <div className='fixed top-[-10%] left-[-10%] w-[50%] h-[50%] glow-indigo pointer-events-none'></div>
      <div className='fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] glow-pink pointer-events-none'></div>
      <Navbar />
      <Header />
    </div>
  )
}

export default Home
