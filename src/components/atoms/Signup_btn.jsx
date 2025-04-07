import { useState } from 'react'
import { Link } from 'react-router-dom'

function SignUpBtn() {
  return (
    <Link to="/signup" className="inline-block">
      <button className="cursor-pointer bg-var-primary text-white font-sans rounded-xl px-4 h-12 w-24 flex items-center justify-center text-sm sm:text-base transition-all duration-300 hover:bg-var-primary-90 focus:outline-none focus:ring-2 ring-var-primary focus:ring-opacity-50">Sign Up</button>
    </Link>
  )
}

export default SignUpBtn;

