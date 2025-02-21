import React from 'react'
import Navbar from '../components_lite/Navbar'
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Link } from "react-router-dom";

const Login = () => {

  return (
    <div className="bg-[#ECF0F1] min-h-screen">
      <Navbar></Navbar>
      <div className=" flex items-center justify-center max-w-7xl- mx-auto">
        <form
          action=""
          className="w-1/2 border border-gray-500 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5 text-center text-[#2C3E50]">
            Login
          </h1>
          <div className="my-2">
            <Label>Email</Label>
            <Input type="text" placeholder="Email"></Input>
          </div>
          <div className="my-2">
            <Label>Password</Label>
            <Input type="text" placeholder="*********"></Input>
          </div>
          <div className="flex-col items-center ">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input 
                type='radio' 
                name='role'
                value='Employee'
                cursor='pointer'
                >
                </Input>
                <Label htmlFor="r1">Employee</Label>
              </div>
              <div className="flex items-center space-x-2">
              <Input 
                type='radio' 
                name='role'
                value='Recruiter'
                cursor='pointer'
                >
                </Input>
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>
            <Button className='flex w-full my-7 bg-[#F39C12] hover:bg-[#d98c0f] rounded-md'> Login </Button>
          </div>
          {/* Login */}
          <p className='flex items-center text-gray-500 text-sm my-2'> 
            Don't have an account?   
            <Link to ='/signup' className='text-blue-700'>Signup</Link>
          </p>
        </form>
      </div>
    </div>
  );
};


export default Login
