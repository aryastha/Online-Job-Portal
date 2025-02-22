import React, {useState} from "react";
import Navbar from "../components_lite/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RadioGroup } from "../ui/radio-group";
import { Link } from "react-router-dom";
import {USER_API_ENDPOINT} from '../utils/data'
import axios from 'axios';
const Signup = () => {

    const [input, setInput] = useState({
      fullname: '',
      email: '',
      password: '',
      role: '',
      phoneNumber:'',
      file: '',
    })
  
    const changeEventHandler = (e) =>{
      setInput({...input, [e.target.name] : e.target.value});
    }

    const ChangeFilehandler = (e) => {
      setInput({ ...input, file: e.target.files?.[0] });
    };
    
    const submitHandler = async (e) => {
      e.preventDefault();
      dispatch(setLoading(true)); // Optional: if you want to show loading before request
    
      const formData = new FormData(); // Correct case: FormData
      formData.append('fullname', input.fullname);
      formData.append('email', input.email);
      formData.append('password', input.password);
      formData.append('role', input.role);
      formData.append('phoneNumber', input.phoneNumber);
      if (input.file) {
        formData.append('file', input.file);
      }
    
      try {
        const res = await axios.post(`${USER_API_ENDPOINT}/signup`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        if (res.data.success) {
          navigate("/login");
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
        const errorMessage = error.response
          ? error.response.data.message
          : "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        dispatch(setLoading(false));
      }
    };
    

  return (
    <div className="bg-[#ECF0F1] min-h-screen">
      <Navbar></Navbar>
      <div className=" flex items-center justify-center max-w-7xl- mx-auto">
        <form
          onSubmit={submitHandler} className="w-1/3 md:w-1/4 border border-gray-300 shadow-lg rounded-lg p-8 my-10 bg-[#F7F9FA]">
          <h1 className="font-bold text-xl mb-5 text-center text-[#2C3E50]">
            Register
          </h1>
          <div className="my-2">
            <Label>Fullname</Label>
            <Input type="text" name='fullname' value={input.fullname} onChange={changeEventHandler} placeholder="Username"></Input>
          </div>
          <div className="my-2">
            <Label>Email</Label>
            <Input type="text" name='email' value={input.email} onChange={changeEventHandler} placeholder="Email"></Input>
          </div>
          <div className="my-2">
            <Label>Password</Label>
            <Input type="text" name='password' value={input.password} onChange={changeEventHandler}  placeholder="*********"></Input>
          </div>
          <div>
            <Label> PhoneNumber</Label>
            <Input type="tel" name='phoneNumber' value={input.phoneNumber} onChange={changeEventHandler}  placeholder="+977 "></Input>
          </div>
          <div className="flex-col items-center ">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input 
                type='radio' 
                name='role'
                value='Employee'
                checked={input.role === 'Employee'}
                onChange = {changeEventHandler}
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
                checked={input.role === 'Recruiter'}
                onChange = {changeEventHandler}
                cursor='pointer'
                >
                </Input>
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>
            <div className='flex items-center gap-2'>
              <Label>Profile Photo</Label>
              <Input 
              type='file' 
              accept='image/*' 
              onChange = {ChangeFilehandler}
              className='cursor-pointer'
              />
            </div>
            <Button type='submit' className='flex w-full my-7 bg-[#F39C12] hover:bg-[#d98c0f] rounded-md'> Signup </Button>
          </div>
          {/* Login */}
          <div className= 'flex items-center justify-between'>
          <p className=' text-gray-500 text-sm my-2'> 
            Already have an account? </p>
            <Link to={'/login'}>              
                               <Button className='bg-[#34566E] hover:bg-[#2C3E50] '> Login </Button>
                              </Link>
          </div>
          
        </form>
      </div>
    </div>
  )
}


export default Signup
