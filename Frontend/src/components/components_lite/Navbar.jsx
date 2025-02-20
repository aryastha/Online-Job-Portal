import React from 'react';
import {Link} from 'react-router-dom';
import {Avatar} from './components/ui/avatar'
const Navbar = () => {
  return (
    <div className="bg-[#ECF0F1] h-screen">
        {/* //right logo */}
      <div className='flex items-center justify-between mx-auto max-w-7xl h-18'>
      <div>
        <h1 className='text-2xl font-bold text-[#2C3E50]'>
            Best<span className='text-[#F39C12]'>Role</span> 
        </h1>
        </div>
        {/* left menus */}
        <div>
            <ul className='flex font-medium gap-6 items-center'>
                <li> Home </li>
                <li> Browse</li>
               
                <li> job </li>
            </ul>

        </div>

      </div>
       
    </div>
  )
}

export default Navbar
