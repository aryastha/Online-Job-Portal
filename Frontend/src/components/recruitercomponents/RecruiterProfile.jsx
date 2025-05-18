import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import axios from "axios";
import { ImageIcon, Loader2, ArrowLeft, Mail, Phone, Building2, Briefcase, Pen } from "lucide-react";
import { USER_API_ENDPOINT } from "@/utils/data";
import { useNavigate } from "react-router-dom";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Navbar from "../components_lite/Navbar";

const RecruiterProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    companyName: "",
    position: "",
  });

  useEffect(() => {
    if (user) {
      setInput({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        companyName: user?.profile?.company || "",
        position: user?.profile?.position || "",
      });
      setPreviewImage(user?.profile?.profilePhoto);
    }
  }, [user]);

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfilePhoto = async () => {
    if (!profilePhotoFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", profilePhotoFile);

    try {
      const res = await axios.post(
        `${USER_API_ENDPOINT}/recruiter/upload-photo`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Profile photo updated successfully!");
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
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // First upload photo if there's a new one
      if (profilePhotoFile) {
        await uploadProfilePhoto();
      }

      // Then update profile details
      const res = await axios.put(
        `${USER_API_ENDPOINT}/recruiter/profile`,
        input,
        {
          withCredentials: true,
        }
      );

      if (res.data.status === 'success') {
        toast.success("Profile updated successfully!");
        dispatch(setUser(res.data.data));
        setIsEditing(false); // Switch back to view mode
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Profile update failed");
    } finally {
      setUploading(false);
    }
  };

  const ProfileView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-[#E67E22]/30"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-[#2C3E50]">{input.fullname}</h2>
            <p className="text-gray-600">{input.position}</p>
          </div>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          variant="outline"
          className="flex items-center gap-2 text-[#E67E22] hover:bg-[#E67E22]/10"
        >
          <Pen className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-600">
            <Mail className="w-5 h-5 text-[#E67E22]" />
            <span>{input.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Phone className="w-5 h-5 text-[#E67E22]" />
            <span>{input.phoneNumber || "No phone number added"}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Building2 className="w-5 h-5 text-[#E67E22]" />
            <span>{input.companyName || "No company added"}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Briefcase className="w-5 h-5 text-[#E67E22]" />
            <span>{input.position || "No position added"}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-[#2C3E50]">Bio</h3>
          <p className="text-gray-600">{input.bio || "No bio added"}</p>
        </div>
      </div>
    </div>
  );

  const ProfileForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Photo Section */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-[#E67E22]/30"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <label
            htmlFor="recruiterPhoto"
            className="absolute bottom-0 right-0 bg-[#E67E22] text-white p-1.5 rounded-full cursor-pointer hover:bg-[#d9731d] transition-colors"
          >
            <input
              type="file"
              id="recruiterPhoto"
              accept="image/*"
              onChange={handleProfilePhotoChange}
              className="hidden"
              disabled={uploading}
            />
            <ImageIcon className="h-4 w-4" />
          </label>
        </div>
        {profilePhotoFile && (
          <p className="text-sm text-green-600">
            New photo selected. Changes will be saved when you update profile.
          </p>
        )}
      </div>

      {/* Profile Details Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullname" className="text-[#2C3E50]">Full Name</Label>
          <Input
            id="fullname"
            name="fullname"
            value={input.fullname}
            onChange={handleInputChange}
            className="border-gray-200 focus:border-[#E67E22] focus:ring-[#E67E22]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#2C3E50]">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={input.email}
            onChange={handleInputChange}
            className="border-gray-200 focus:border-[#E67E22] focus:ring-[#E67E22]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-[#2C3E50]">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={input.phoneNumber}
            onChange={handleInputChange}
            className="border-gray-200 focus:border-[#E67E22] focus:ring-[#E67E22]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-[#2C3E50]">Company Name</Label>
          <Input
            id="companyName"
            name="companyName"
            value={input.companyName}
            onChange={handleInputChange}
            className="border-gray-200 focus:border-[#E67E22] focus:ring-[#E67E22]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position" className="text-[#2C3E50]">Position</Label>
          <Input
            id="position"
            name="position"
            value={input.position}
            onChange={handleInputChange}
            className="border-gray-200 focus:border-[#E67E22] focus:ring-[#E67E22]"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bio" className="text-[#2C3E50]">Bio</Label>
          <textarea
            id="bio"
            name="bio"
            value={input.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full rounded-md border border-gray-200 focus:border-[#E67E22] focus:ring-[#E67E22] min-h-[100px] p-3"
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsEditing(false)}
          className="text-gray-600"
          disabled={uploading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={uploading}
          className="bg-[#E67E22] hover:bg-[#d9731d] text-white min-w-[150px]"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/recruiter/dashboard")}
            className="text-[#2C3E50] hover:bg-[#E67E22]/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-[#2C3E50]">
            {isEditing ? "Edit Profile" : "Profile"}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            {isEditing ? <ProfileForm /> : <ProfileView />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;
