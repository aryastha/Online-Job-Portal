import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { LogOut, User2 } from 'lucide-react';
import {useSelector} from 'react-redux';

const Navbar = () => {
  
  const {user} =useSelector((store) => store.auth);
  


  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold text-[#2C3E50]">
            Best<span className="text-[#E67E22]">Role</span>
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <ul className="flex font-medium gap-6 items-center text-[#2C3E50]">
            <li>
              <Link
                to="/"
                className="hover:text-[#E67E22] transition-all duration-300 text-base"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/browse"
                className="hover:text-[#E67E22] transition-all duration-300 text-base"
              >
                Browse
              </Link>
            </li>
            <li>
              <Link
                to="/jobs"
                className="hover:text-[#E67E22] transition-all duration-300 text-base"
              >
                Jobs
              </Link>
            </li>
            <li>
              <Link
                to="/companies"
                className="hover:text-[#E67E22] transition-all duration-300 text-base"
              >
                Companies
              </Link>
            </li>
          </ul>

          {/* User Login/Signup or Avatar */}
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/register">
                <Button className="bg-[#E67E22] hover:bg-[#d9731d] text-white transition-all duration-300">
                  Signup
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="text-[#2C3E50] border-[#2C3E50] hover:bg-[#E67E22] hover:text-white hover:border-[#E67E22] transition-all duration-300"
                >
                  Login
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer hover:opacity-80 transition-all duration-300">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 space-y-4">
                <div className="flex gap-4 items-center">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="font-medium text-[#2C3E50]">Arya Shrestha</h1>
                    <p className="text-sm text-gray-500">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 hover:bg-gray-100 text-[#2C3E50]"
                  >
                    <User2 size={16} />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 hover:bg-gray-100 text-[#2C3E50]"
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;