import React, { useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RadioGroup } from "../ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_ENDPOINT } from "@/utils/data.js";
import axios from "axios";
import { toast } from "sonner";
import {setLoading} from '@/redux/authSlice.js';
import {useDispatch, useSelector} from 'react-redux';

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {loading} = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
        header: { "Content type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/"), toast.success(res.data.messasge);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response
        ? error.response.data.message
        : "An unexpected error occurred.";
      toast.error(errorMessage);
    }finally{
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="bg-[#ECF0F1] min-h-screen">
      <Navbar></Navbar>
      <div className=" flex items-center justify-center max-w-7xl- mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/3 md:w-1/4 border border-gray-300 shadow-lg rounded-lg p-8 my-10 bg-[#F7F9FA]"
        >
          <h1 className="font-bold text-xl mb-5 text-center text-[#2C3E50]">
            Login
          </h1>

          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="text"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="Email"
            ></Input>
          </div>
          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="text"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="*********"
            ></Input>
          </div>
          <div className="flex-col items-center ">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="Employee"
                  checked={input.role === "Employee"}
                  onChange={changeEventHandler}
                  cursor="pointer"
                />
                <Label htmlFor="r1">Employee</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="Recruiter"
                  checked={input.role === "Recruiter"}
                  onChange={changeEventHandler}
                  cursor="pointer"
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>

            {loading?(
                          <div className = 'flex items-center justify-center my-10'>
                            <div className='spinner-border text-blue-600' role='status'>
                              <span className='sr-only'>Loading...</span>
                            </div>
                          </div>
                        ):(
                          <Button
                          type="submit"
                          className="flex w-full my-7 bg-[#F39C12] hover:bg-[#d98c0f] rounded-md"
                        >
                          {" "}
                          Login{" "}
                        </Button>
                        )
                        }
            
           
          </div>
          {/* Sign up */}
          <div className="flex items-center justify-between">
            <p className=" text-gray-500 text-sm my-2">
              Don't have an account?{" "}
            </p>
            <Link to={"/register"}>
              <Button className="bg-[#34566E] hover:bg-[#2C3E50] ">
                {" "}
                Register{" "}
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
