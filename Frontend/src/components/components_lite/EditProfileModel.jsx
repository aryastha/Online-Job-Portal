import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data";
import { setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import axios from "axios"; 

const EditProfileModel = ({ open, setOpen }) => {

  const [loading, setLoading] = useState(false);

  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    fullname: user?.fullname,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    bio: user?.profile?.bio,
    skills: user?.profile?.skills?.map((skill)=> skill),
    file: user?.profile?.resume,
  });

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const FileChangehandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const handleFileChange = async (e) => {
    e.preventDefault();
    console.log(input);
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_ENDPOINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multi-part/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser({ ...res.data.user, skills: input.skills }));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }

    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogContent className="sm:max-w-[500px]"
        onInteractOutside = {() => setOpen(false)}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          {/*edit profile form  */}
          <div>
            <form onSubmit={handleFileChange}>
              <div className="grid gap-4 py-4">
                {/* Full name */}
                <div className="grid grid-cols-4 items-center">
                  <Label htmlFor="name">Full Name:</Label>
                  <input
                    type="text"
                    id="name"
                    value={input.fullname}
                    onChange={changeEventHandler}
                    name="fullname"
                    className="col-span-3 border border-gray-300 rounded-md p-1"
                  />
                </div>
                {/* Email */}
                <div className="grid grid-cols-4 items-center">
                  <Label htmlFor="email">Email :</Label>
                  <input
                    type="text"
                    id="email"
                    value={input.email}
                    name="email"
                    onChange={changeEventHandler}
                    className="col-span-3 border border-gray-300 rounded-md p-1"
                  />
                </div>
                {/* Phone Number */}
                <div className="grid grid-cols-4 items-center">
                  <Label htmlFor="phone">Contact Number:</Label>
                  <input
                    type="text"
                    id="phone"
                    value={input.phoneNumber}
                    name="phoneNumber"
                    onChange={changeEventHandler}
                    className="col-span-3 border border-gray-300 rounded-md p-1"
                  />
                </div>
                {/* Bio */}
                <div className="grid grid-cols-4 items-center">
                  <Label htmlFor="bio">Bio: </Label>
                  <input
                    type="text"
                    id="bio"
                    value={input.bio}
                    name="bio"
                    onChange={changeEventHandler}
                    className="col-span-3 border border-gray-300 rounded-md p-1"
                  />
                </div>
                {/* skills */}
                <div className="grid grid-cols-4 items-center">
                  <Label htmlFor="skills">Skills:</Label>
                  <input
                    id="skills"
                    name="skills"
                    value={input.skills}
                    onChange={changeEventHandler}
                    className="col-span-3 border border-gray-300 rounded-md p-1"
                  />
                </div>
                {/* Resume */}
                <div className="grid grid-cols-4 items-center">
                  <Label htmlFor="file">Profile:</Label>
                  <input
                    type="file"
                    id="file"
                    accept="application/file"
                    name="file"
                    onChange={FileChangehandler}
                    className="col-span-3 border border-gray-300 rounded-md p-1"
                  />
                </div>
              </div>

              <div className="grid place-items-center">
                <DialogFooter>
                  {loading ? (
                    <Button>
                      {" "}
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      wait{" "}
                    </Button>
                  ) : (
                    <Button className=" bg-[#E67E22] hover:bg-[#d9731d] text-white transition-all duration-300 mt-4 ">
                      Update
                    </Button>
                  )}
                </DialogFooter>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProfileModel;
