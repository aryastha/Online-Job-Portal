import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { LogOut, User2, Bookmark } from "lucide-react";
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
      } else {
        console.error("Error logging out:", res.data);
      }
    } catch (error) {
      console.error("Axios error:,", error);
      if (error.response) {
        console.error("Error response: ", error.response.data);
      }
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
                    to="/admin/jobs"
                    className="hover:text-[#E67E22] transition-all duration-300 text-base"
                  >
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="admin/companies"
                    className="hover:text-[#E67E22] transition-all duration-300 text-base"
                  >
                    Companies
                  </Link>
                </li>
              </>
            ) : (
              <>
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
                {/* Resume */}

                <li>
                  <Link
                    to="/resume/create"
                    className="hover:text-[#E67E22] transition-all duration-300 text-base"
                  >
                    Resume Builder
                  </Link>
                </li>
              </>
            )}
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
                  <AvatarImage src={user?.profile.profilePhoto} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 space-y-4">
                <div className="flex gap-4 items-center">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user?.profile.profilePhoto} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="font-medium text-[#2C3E50]">
                      {user?.fullname}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  {/* User Profile */}

                  {user && user.role === "Recruiter" ? (
                    <Link to="/admin/profile">
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
                  <Button
                    onClick={logoutHandler}
                    variant="link"
                    className="w-full justify-start gap-2 hover:bg-gray-100 text-[#2C3E50]"
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                  <Link to="/saved/jobs">
                    <Button
                      variant="link"
                      className="w-full justify-start gap-2 hover:bg-gray-100 text-[#2C3E50]"
                    >
                      <Bookmark size={16} />
                      Saved Jobs
                    </Button>
                  </Link>
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
