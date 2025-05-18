import React, { useState } from "react";
import Navbar from "./Navbar";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Pen,
  Mail,
  Contact,
  Download,
  FileText,
  ChevronRight,
} from "lucide-react";
import AppliedJobs from "./AppliedJobs";
import EditProfileModel from "./EditProfileModel";
import { useSelector } from "react-redux";
import useGetAllAppliedJobs from "@/hooks/useGetAllAppliedJobs";
import axios from "axios";
import { toast } from "sonner";

const Profile = () => {
  useGetAllAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const isResume = Boolean(user?.profile?.resume);
  const [loading, setLoading] = useState(false);

  const handleDownloadResume = async () => {
    try {
      setLoading(true);
      const response = await axios.get(user?.profile?.resume, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          // You could use this for a progress indicator if needed
        },
      });

      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `${user?.fullname || 'My'}_Resume.pdf`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) filename = filenameMatch[1];
      }

      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' })
      );

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        link.remove();
        window.URL.revokeObjectURL(url);
        setLoading(false);
        toast.success("Resume downloaded successfully!");
      }, 100);
    } catch (error) {
      console.error("Error downloading resume:", error);
      setLoading(false);
      toast.error("Failed to download resume. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="p-6 md:p-8">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <Avatar className="h-full w-full">
                    <AvatarImage
                      src={
                        user?.profile?.profilePhoto ||
                        "https://via.placeholder.com/150"
                      }
                      alt="Profile picture"
                      className="w-full h-full object-cover"
                    />
                  </Avatar>
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user?.fullname}
                  </h1>
                  <p className="text-gray-600 max-w-2xl text-sm md:text-base">
                    {user?.profile?.bio || "No bio added yet"}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
              >
                <Pen size={16} />
                Edit Profile
              </Button>
            </div>

            {/* Contact & Details Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Info */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#d9731d] rounded-full"></span>
                  Contact Information
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail size={18} className="text-[#d9731d]" />
                    <a
                      href={`mailto:${user?.email}`}
                      className="hover:text-[#d9731d] hover:underline"
                    >
                      {user?.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <Contact size={18} className="text-[#d9731d]" />
                    <a
                      href={`tel:${user?.phoneNumber}`}
                      className="hover:text-[#d9731d] hover:underline"
                    >
                      {user?.phoneNumber || "Not provided"}
                    </a>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#d9731d] rounded-full"></span>
                  Skills & Expertise
                </h2>

                <div className="flex flex-wrap gap-2">
                  {user?.profile?.skills?.length ? (
                    user.profile.skills.map((item, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-3 py-1 font-medium bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      >
                        {item}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No skills added yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Resume Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <span className="w-1 h-6 bg-[#d9731d] rounded-full"></span>
                Resume
              </h2>

              {isResume ? (
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="bg-[#d9731d]/10 p-3 rounded-full">
                    <FileText className="text-[#d9731d]" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">My Resume</p>
                    <p className="text-sm text-gray-500">Click to download</p>
                  </div>
                  <button
                    onClick={handleDownloadResume}
                    disabled={loading}
                    className="text-[#d9731d] hover:text-[#b35917] disabled:opacity-50"
                  >
                    {loading ? 'Downloading...' : <Download size={20} />}
                  </button>
                </div>
              ) : (
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-gray-500">No resume uploaded yet</p>
                  <Button
                    variant="link"
                    className="text-[#d9731d] hover:text-[#b35917] p-0 h-auto"
                    onClick={() => setOpen(true)}
                  >
                    Upload now <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Applied Jobs Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Applied Jobs</h2>
              {/* <Button
                variant="ghost"
                className="text-[#d9731d] hover:bg-[#d9731d]/10"
              >
                View all <ChevronRight size={16} className="ml-1" />
              </Button> */}
            </div>
            <AppliedJobs />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModel open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;

//  import React, { useState } from "react";
// import Navbar from "./Navbar";
// import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
// import { Button } from "../ui/button";
// import { Badge } from "../ui/badge";
// import {
//   Pen,
//   Mail,
//   Contact,
//   Download,
//   FileText,
//   ChevronRight,
// } from "lucide-react";
// import AppliedJobs from "./AppliedJobs";
// import EditProfileModel from "./EditProfileModel";
// import { useSelector } from "react-redux";
// import useGetAllAppliedJobs from "@/hooks/useGetAllAppliedJobs";

// const Profile = () => {
//   useGetAllAppliedJobs();
//   const [open, setOpen] = useState(false);
//   const { user } = useSelector((store) => store.auth);
//   const isResume = Boolean(user?.profile?.resume);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />

//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Profile Card */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
//           <div className="p-6 md:p-8">
//             {/* Profile Header */}
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//               <div className="flex items-center gap-5">
//                 <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-white shadow-md">
//                   <Avatar className="h-full w-full">
//                     <AvatarImage
//                       src={
//                         user?.profile?.profilePhoto ||
//                         "https://via.placeholder.com/150"
//                       }
//                       alt="Profile picture"
//                       className="w-full h-full object-cover"
//                     />
//                   </Avatar>
//                 </div>

//                 <div className="space-y-1">
//                   <h1 className="text-2xl font-bold text-gray-900">
//                     {user?.fullname}
//                   </h1>
//                   <p className="text-gray-600 max-w-2xl text-sm md:text-base">
//                     {user?.profile?.bio || "No bio added yet"}
//                   </p>
//                 </div>
//               </div>

//               <Button
//                 onClick={() => setOpen(true)}
//                 variant="outline"
//                 className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
//               >
//                 <Pen size={16} />
//                 Edit Profile
//               </Button>
//             </div>

//             {/* Contact & Details Section */}
//             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Contact Info */}
//               <div className="space-y-4">
//                 <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                   <span className="w-1 h-6 bg-[#d9731d] rounded-full"></span>
//                   Contact Information
//                 </h2>

//                 <div className="space-y-3">
//                   <div className="flex items-center gap-3 text-gray-700">
//                     <Mail size={18} className="text-[#d9731d]" />
//                     <a
//                       href={`mailto:${user?.email}`}
//                       className="hover:text-[#d9731d] hover:underline"
//                     >
//                       {user?.email}
//                     </a>
//                   </div>

//                   <div className="flex items-center gap-3 text-gray-700">
//                     <Contact size={18} className="text-[#d9731d]" />
//                     <a
//                       href={`tel:${user?.phoneNumber}`}
//                       className="hover:text-[#d9731d] hover:underline"
//                     >
//                       {user?.phoneNumber || "Not provided"}
//                     </a>
//                   </div>
//                 </div>
//               </div>

//               {/* Skills Section */}
//               <div className="space-y-4">
//                 <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                   <span className="w-1 h-6 bg-[#d9731d] rounded-full"></span>
//                   Skills & Expertise
//                 </h2>

//                 <div className="flex flex-wrap gap-2">
//                   {user?.profile?.skills?.length ? (
//                     user.profile.skills.map((item, index) => (
//                       <Badge
//                         key={index}
//                         variant="outline"
//                         className="px-3 py-1 font-medium bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
//                       >
//                         {item}
//                       </Badge>
//                     ))
//                   ) : (
//                     <p className="text-gray-500 text-sm">No skills added yet</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Resume Section */}
//             <div className="mt-8">
//               <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
//                 <span className="w-1 h-6 bg-[#d9731d] rounded-full"></span>
//                 Resume
//               </h2>

//               {isResume ? (
//                 <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
//                   <div className="bg-[#d9731d]/10 p-3 rounded-full">
//                     <FileText className="text-[#d9731d]" size={20} />
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-medium">My Resume</p>
//                     <p className="text-sm text-gray-500">Click to download</p>
//                   </div>
//                   <a
//                     href={`${user?.profile?.resume}?fl_attachment=${encodeURIComponent(user?.fullname || 'My')}_Resume.pdf`}
//                     download={`${user?.fullname || 'My'}_Resume.pdf`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-[#d9731d] hover:text-[#b35917]"
//                   >
//                     <Download size={20} />
//                   </a>
//                 </div>
//               ) : (
//                 <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
//                   <p className="text-gray-500">No resume uploaded yet</p>
//                   <Button
//                     variant="link"
//                     className="text-[#d9731d] hover:text-[#b35917] p-0 h-auto"
//                     onClick={() => setOpen(true)}
//                   >
//                     Upload now <ChevronRight size={16} className="ml-1" />
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Applied Jobs Section */}
//         <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="p-6 md:p-8">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-bold text-gray-900">Applied Jobs</h2>
//               <Button
//                 variant="ghost"
//                 className="text-[#d9731d] hover:bg-[#d9731d]/10"
//               >
//                 View all <ChevronRight size={16} className="ml-1" />
//               </Button>
//             </div>
//             <AppliedJobs />
//           </div>
//         </div>
//       </div>

//       {/* Edit Profile Modal */}
//       <EditProfileModel open={open} setOpen={setOpen} />
//     </div>
//   );
// };

// export default Profile;