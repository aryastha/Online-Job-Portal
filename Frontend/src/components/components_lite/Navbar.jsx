import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { LogOut, User2, Bookmark, MessageSquare, Calendar, Plus, Briefcase, Building, Clock, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/data";
import { setUser } from "@/redux/authSlice";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/logout`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Error logging out. Please try again.");
    }
  };

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
            {/* User Role */}
            {user && user.role === "Recruiter" ? (
              <>
              <li>
                  <Link
                    to="/recruiter/dashboard"
                    className="hover:text-[#E67E22] transition-all duration-300 text-base flex items-center gap-1"
                  >
                    <Users className="w-4 h-4" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/recruiter/jobs"
                    className="hover:text-[#E67E22] transition-all duration-300 text-base flex items-center gap-1"
                  >
                    <Briefcase className="w-4 h-4" />
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/recruiter/companies"
                    className="hover:text-[#E67E22] transition-all duration-300 text-base flex items-center gap-1"
                  >
                    <Building className="w-4 h-4" />
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/recruiter/applicants"
                    className="hover:text-[#E67E22] transition-all duration-300 text-base flex items-center gap-1"
                  >
                    <Users className="w-4 h-4" />
                    Candidates
                  </Link>
                </li>
                <li className="relative group">
                  <Link
                    to="/interviews"
                    className="hover:text-[#E67E22] transition-all duration-300 text-base flex items-center gap-1"
                  >
                    <Calendar className="w-4 h-4" />
                    Interviews
                  </Link>
                  {/* Interview dropdown */}
                  <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-1 p-2 w-48 z-10 border border-gray-100">
                    <Link
                      to="/interviews"
                      className="block px-3 py-2 text-sm hover:bg-orange-50 rounded hover:text-[#E67E22]"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        View All
                      </div>
                    </Link>
                    <Link
                      to="/recruiter/interviews/schedule"
                      className="block px-3 py-2 text-sm hover:bg-orange-50 rounded hover:text-[#E67E22]"
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Schedule New
                      </div>
                    </Link>
                    <Link
                      to="/interviews/calendar"
                      className="block px-3 py-2 text-sm hover:bg-orange-50 rounded hover:text-[#E67E22]"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Calendar View
                      </div>
                    </Link>
                  </div>
                </li>
                <li>
                  <Link
                    to="/messages"
                    className="hover:text-[#E67E22] transition-all duration-300 text-base flex items-center gap-1"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Messages
                  </Link>
                </li>
              </>
            ) : user && user.role === "Admin" ? (
              <>
                <li>
                  <Link
                    to="/admin/users"
                    className="hover:text-[#E67E22] transition-all duration-300 text-base"
                  >
                    Users
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/companies"
                    className="hover:text-[#E67E22] transition-all duration-300 text-base"
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs"
                    className="hover:text-[#E67E22] transition-all duration-300 text-base"
                  >
                    Jobs
                  </Link>
                </li>
              </>
            ) : user && user.role === "Employee" ? (
              <>
                <li>
                  <Link
                    to="/"
                    className="hover:text-[#E67E22] transition-all duration-300 text-base"
                  >
                    Dashboard
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
                    to="/interviews"
                    className="hover:text-[#E67E22] transition-all duration-300 text-base flex items-center gap-1"
                  >
                    <Calendar className="w-4 h-4" />
                    Interviews
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resume/create"
                    className="hover:text-[#E67E22] transition-all duration-300 text-base"
                  >
                    Resume Builder
                  </Link>
                </li>
                <li>
                  <Link
                    to="/messages"
                    className="hover:text-[#E67E22] transition-all duration-300 text-base flex items-center gap-1"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Messages
                  </Link>
                </li>
              </>
            ) : null}
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
                  <AvatarImage src={user?.profile?.profilePhoto} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 space-y-4">
                <div className="flex gap-4 items-center">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user?.profile?.profilePhoto} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="font-medium text-[#2C3E50]">
                      {user?.fullname}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {user?.role}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  {user && user.role !== "Admin" && (
                    <>
                      {user.role === "Recruiter" ? (
                        <Link to="/recruiter/profile">
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 hover:bg-gray-100 text-[#2C3E50]"
                          >
                            <User2 size={16} />
                            Profile
                          </Button>
                        </Link>
                      ) : (
                        <Link to="/profile">
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 hover:bg-gray-100 text-[#2C3E50]"
                          >
                            <User2 size={16} />
                            Profile
                          </Button>
                        </Link>
                      )}
                    </>
                  )}
                  
                  {user && user.role === "Employee" && (
                    <Link to="/saved/jobs">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 hover:bg-gray-100 text-[#2C3E50]"
                      >
                        <Bookmark size={16} />
                        Saved Jobs
                      </Button>
                    </Link>
                  )}
                  
                  <Button
                    onClick={logoutHandler}
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