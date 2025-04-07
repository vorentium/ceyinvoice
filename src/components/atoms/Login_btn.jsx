import { useState } from 'react'
import { Link } from 'react-router-dom'

function LoginBtn() {
  return (
    <Link to="/login" className="inline-block">
      <button className="cursor-pointer bg-white text-black border-2 border-var-primary font-sans rounded-xl px-4 h-12 w-24 flex items-center justify-center text-sm sm:text-base transition-all duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 ring-var-primary focus:ring-opacity-50 hover:bg-var-primary hover:text-white">Login</button>
    </Link>
  )
}

export default LoginBtn;

