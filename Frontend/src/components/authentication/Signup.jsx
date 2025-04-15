import React, { useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RadioGroup } from "../ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_ENDPOINT } from "@/utils/data.js";
import axios from "axios";
import { toast } from "sonner";
import { setLoading } from "@/redux/authSlice.js";
import { useEffect } from "react";

const Register = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
    phoneNumber: "",
    file: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const ChangeFilehandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("role", input.role);
    formData.append("phoneNumber", input.phoneNumber);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response
        ? error.response.data.message
        : "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(()=>{
      if (user){
        navigate("/")
      }
    },[])

  return (
    <div className="bg-[#F7F9FA] min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-full md:w-1/2 lg:w-1/3 border border-gray-200 shadow-lg rounded-lg p-8 my-10 bg-white"
        >
          <h1 className="font-bold text-2xl mb-6 text-center text-[#2C3E50]">
            Register
          </h1>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-[#2C3E50]">Fullname</Label>
              <Input
                type="text"
                name="fullname"
                value={input.fullname}
                onChange={changeEventHandler}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-[#2C3E50]">Email</Label>
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                placeholder="Enter your email"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-[#2C3E50]">Password</Label>
              <Input
                type="password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                placeholder="*********"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-[#2C3E50]">Phone Number</Label>
              <Input
                type="tel"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                placeholder="+977"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-[#2C3E50]">Role</Label>
              <RadioGroup className="flex items-center gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="Employee"
                    checked={input.role === "Employee"}
                    onChange={changeEventHandler}
                    className="cursor-pointer"
                  />
                  <Label>Employee</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="Recruiter"
                    checked={input.role === "Recruiter"}
                    onChange={changeEventHandler}
                    className="cursor-pointer"
                  />
                  <Label>Recruiter</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label className="text-sm font-medium text-[#2C3E50]">Profile Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={ChangeFilehandler}
                className="mt-1 cursor-pointer"
              />
            </div>
            {loading ? (
              <div className="flex items-center justify-center my-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E67E22]"></div>
              </div>
            ) : (
              <Button
                type="submit"
                className="w-full mt-6 bg-[#E67E22] hover:bg-[#d9731d] text-white font-medium"
              >
                Register
              </Button>
            )}
            <p className="text-sm text-gray-600 mt-4 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-[#E67E22] hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;