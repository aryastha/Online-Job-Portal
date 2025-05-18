import React, { useState, useEffect } from "react";
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
import { Loader2, FileText, ImageIcon } from "lucide-react";
import axios from "axios";

const EditProfileModel = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const dispatch = useDispatch();

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setInput({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || "",
      });
      setPreviewImage(user?.profile?.profilePhoto || null);
    }
  }, [user, open]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhotoFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfilePhoto = async () => {
    if (!profilePhotoFile) return true;

    setFileUploading(true);
    const formData = new FormData();
    formData.append("file", profilePhotoFile);

    try {
      const res = await axios.post(
        `${USER_API_ENDPOINT}/profile/upload-photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Profile photo updated successfully");
        dispatch(
          setUser({
            ...user,
            profile: {
              ...user.profile,
              profilePhoto: res.data.profilePhoto,
            },
          })
        );
        setProfilePhotoFile(null);
        return true;
      }
    } catch (error) {
      console.error("Photo upload error:", error);
      toast.error(
        error.response?.data?.message || "Profile photo upload failed"
      );
      return false;
    } finally {
      setFileUploading(false);
    }
  };

  const uploadResume = async () => {
    if (!resumeFile) return true;

    setFileUploading(true);
    const formData = new FormData();
    formData.append("file", resumeFile);

    try {
      const res = await axios.post(
        `${USER_API_ENDPOINT}/profile/upload-resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Resume uploaded successfully");
        dispatch(
          setUser({
            ...user,
            profile: {
              ...user.profile,
              resume: res.data.resumeUrl,
              resumeOriginalname: resumeFile.name,
            },
          })
        );
        setResumeFile(null);
        return true;
      }
    } catch (error) {
      console.error("Resume upload error:", error);
      toast.error(error.response?.data?.message || "Resume upload failed");
      return false;
    } finally {
      setFileUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // First handle file uploads if needed
    let photoUploadSuccess = true;
    let resumeUploadSuccess = true;

    if (profilePhotoFile) {
      photoUploadSuccess = await uploadProfilePhoto();
    }

    if (resumeFile) {
      resumeUploadSuccess = await uploadResume();
    }

    // Only proceed with profile update if file uploads were successful
    if (photoUploadSuccess && resumeUploadSuccess) {
      try {
        const res = await axios.post(
          `${USER_API_ENDPOINT}/profile/update`,
          {
            fullname: input.fullname,
            email: input.email,
            phoneNumber: input.phoneNumber,
            bio: input.bio,
            skills: input.skills,
          },
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          toast.success(res.data.message);
          dispatch(setUser(res.data.user));
          setOpen(false);
        }
      } catch (error) {
        console.error("Profile update error:", error);
        toast.error(error.response?.data?.message || "Profile update failed");
      }
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] bg-white shadow-lg rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className="relative">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <label
                htmlFor="profilePhoto"
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600"
              >
                <input
                  type="file"
                  id="profilePhoto"
                  name="profilePhoto"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  className="hidden"
                  disabled={fileUploading}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
            </div>
            <p className="text-sm text-gray-500">
              Click on the icon to change profile picture
            </p>
            {profilePhotoFile && (
              <p className="text-sm text-green-600">
                New photo selected (will be saved when you click Update Profile)
              </p>
            )}
          </div>

          <div className="grid gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="fullname" className="text-gray-700">
                Full Name
              </Label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={input.fullname}
                onChange={changeEventHandler}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <input
                type="email"
                id="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="phoneNumber" className="text-gray-700">
                Contact Number
              </Label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="bio" className="text-gray-700">
                Bio
              </Label>
              <textarea
                id="bio"
                name="bio"
                value={input.bio}
                onChange={changeEventHandler}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              ></textarea>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="skills" className="text-gray-700">
                Skills (comma-separated)
              </Label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={input.skills}
                onChange={changeEventHandler}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="resume" className="text-gray-700">
              Resume
            </Label>
            <input
              type="file"
              id="resume"
              name="resume"
              onChange={handleResumeChange}
              className="p-2"
              disabled={fileUploading}
            />
            {user?.profile?.resume && !resumeFile && (
              <FileText className="text-blue-500" />
            )}
            {resumeFile && (
              <span className="text-sm text-green-600">
                New resume selected
              </span>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              disabled={loading || fileUploading}
            >
              {loading || fileUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {fileUploading ? "Uploading files..." : "Updating profile..."}
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModel;
