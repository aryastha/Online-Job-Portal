import React from 'react';
import {Link} from 'react-router-dom';
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {Popover, PopoverTrigger, PopoverContent} from '../ui/popover';
import { LogOut, User2 } from 'lucide-react';

const Navbar = () => {
   const user = false;



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
        <div className= "flex items-center gap-10">
            <ul className='flex font-medium gap-6 items-center text-[#2C3E50]'>
                <li> Home </li>
                <li> Browse</li>
                <li> job </li>
                <li> Companies </li>
            </ul>
            {/*  user login signup */}
            {
              !user?(
                <div className='flex items-center gap-2'>
                  <Button variant='outline'> Login </Button>
                  <Button className='bg-[#F39C12] hover:bg-[#d98c0f]'> Signup </Button>
                </div>                
              ) : (
                <Popover>
                <PopoverTrigger asChild>
                  <Avatar className='cursor-pointer'>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className='w-80 space-y-2'>
                <div className='flex gap-12 items-center space-y-2'>
                <Avatar className='cursor-pointer'>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                  <h1 className='font-medium' > Arya Shrestha </h1>
                  <p className= 'text-sm text-muted-foreground '> Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  </p>
                  </div>
                </div>
                <div className='flex flex-col text-gray-600 '>
                  <div className='flex cursor-pointer w-fit gap-2 items-center'>
                    <User2></User2>
                  <Button variant="link">Profile</Button>
                  </div>
                  <div className='flex cursor-pointer w-fit gap-2 items-center'>
                  <LogOut></LogOut>
                  <Button variant="link">Logout</Button>
                  </div>
                </div>
                </PopoverContent> 
                </Popover>
              )
            }
          
        </div>
      </div>
    </div>
  )
}

export default Navbar
