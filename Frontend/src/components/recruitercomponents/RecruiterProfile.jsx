// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
// import { Button } from "../ui/button";
// import { Mail, Phone, Building2, Pen, Globe, Briefcase, Users, BarChart2 } from "lucide-react";
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar
// } from "recharts";
// import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
// import { Badge } from "../ui/badge";

// const recruiterStats = [
//   { name: "Jan", posts: 3, applicants: 40, hires: 5 },
//   { name: "Feb", posts: 5, applicants: 80, hires: 12 },
//   { name: "Mar", posts: 2, applicants: 25, hires: 3 },
//   { name: "Apr", posts: 4, applicants: 65, hires: 8 },
//   { name: "May", posts: 6, applicants: 90, hires: 15 },
// ];

// const RecruiterProfile = () => {
//   const [open, setOpen] = useState(false);
//   const { user } = useSelector((state) => state.auth);

//   // Calculate totals for stats cards
//   const totalStats = recruiterStats.reduce((acc, curr) => {
//     return {
//       posts: acc.posts + curr.posts,
//       applicants: acc.applicants + curr.applicants,
//       hires: acc.hires + curr.hires
//     };
//   }, { posts: 0, applicants: 0, hires: 0 });

//   return (
//     <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
//       {/* Header Section */}
//       <div className="bg-gradient-to-r from-[#2C3E50] to-[#d9731d] p-6 rounded-2xl shadow-lg text-white">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//           <div className="flex items-center gap-6">
//             <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white/20">
//               <Avatar className="h-full w-full">
//                 <AvatarImage
//                   src={user?.profile?.profilePhoto}
//                   alt="profile"
//                   className="w-full h-full object-cover"
//                 />
//               </Avatar>
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold">{user?.fullname}</h1>
//               <p className="text-white/90">{user?.companyName}</p>
//               {user?.profile?.title && (
//                 <p className="text-white/80 text-sm mt-1">{user.profile.title}</p>
//               )}
//             </div>
//           </div>

//           <Button 
//             onClick={() => setOpen(true)} 
//             className="flex items-center gap-2 bg-white text-[#2C3E50] hover:bg-white/90"
//           >
//             <Pen size={16} /> Edit Profile
//           </Button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card className="hover:shadow-[#d9731d]/50 transition-shadow">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Total Job Posts</CardTitle>
//             <Briefcase className="h-4 w-4 text-[#d9731d]" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{totalStats.posts}</div>
//             <p className="text-xs text-muted-foreground">
//               +{Math.round((recruiterStats[recruiterStats.length-1].posts / totalStats.posts) * 100)}% from last month
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="hover:shadow-[#d9731d]/50 transition-shadow">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
//             <Users className="h-4 w-4 text-[#d9731d]" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{totalStats.applicants}</div>
//             <p className="text-xs text-muted-foreground">
//               +{Math.round((recruiterStats[recruiterStats.length-1].applicants / totalStats.applicants) * 100)}% from last month
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="hover:shadow-[#d9731d]/50 transition-shadow">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Successful Hires</CardTitle>
//             <BarChart2 className="h-4 w-4 text-[#d9731d]" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{totalStats.hires}</div>
//             <p className="text-xs text-muted-foreground">
//               +{Math.round((recruiterStats[recruiterStats.length-1].hires / totalStats.hires) * 100)}% from last month
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Main Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column - Contact Info */}
//         <div className="space-y-6 lg:col-span-1">
//           <Card className="hover:shadow-[#d9731d]/50 transition-shadow">
//             <CardHeader>
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <Mail className="h-5 w-5" /> Contact Information
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <Mail size={18} className="text-[#d9731d]" />
//                 <span>{user?.email}</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Phone size={18} className="text-[#d9731d]" />
//                 <span>{user?.phoneNumber || "Not provided"}</span>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="hover:shadow-[#d9731d]/50 transition-shadow">
//             <CardHeader>
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <Building2 className="h-5 w-5" /> Company Information
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <Building2 size={18} className="text-[#d9731d]" />
//                 <span>{user?.companyName}</span>
//               </div>
//               {user?.companyWebsite && (
//                 <div className="flex items-center gap-3">
//                   <Globe size={18} className="text-[#d9731d]" />
//                   <a 
//                     href={user.companyWebsite.startsWith('http') ? user.companyWebsite : `https://${user.companyWebsite}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:underline"
//                   >
//                     {user.companyWebsite}
//                   </a>
//                 </div>
//               )}
//               {user?.companySize && (
//                 <div className="flex items-center gap-3">
//                   <Users size={18} className="text-[#d9731d]" />
//                   <span>{user.companySize} employees</span>
//                 </div>
//               )}
//               {user?.industry && (
//                 <div className="mt-4">
//                   <h4 className="text-sm font-medium mb-2">Industry</h4>
//                   <Badge variant="outline" className="text-[#d9731d] border-[#d9731d]">
//                     {user.industry}
//                   </Badge>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right Column - Analytics */}
//         <div className="space-y-6 lg:col-span-2">
//           <Card className="hover:shadow-[#d9731d]/50 transition-shadow">
//             <CardHeader>
//               <CardTitle className="text-lg">Job Posts & Applicants</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={recruiterStats}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip 
//                       contentStyle={{
//                         backgroundColor: '#2C3E50',
//                         borderColor: '#d9731d',
//                         borderRadius: '8px',
//                         color: 'white'
//                       }}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="posts" 
//                       stroke="#d9731d" 
//                       strokeWidth={2}
//                       name="Job Posts" 
//                       activeDot={{ r: 8 }}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="applicants" 
//                       stroke="#2C3E50" 
//                       strokeWidth={2}
//                       name="Applicants" 
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="hover:shadow-[#d9731d]/50 transition-shadow">
//             <CardHeader>
//               <CardTitle className="text-lg">Hiring Success Rate</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={recruiterStats}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip 
//                       contentStyle={{
//                         backgroundColor: '#2C3E50',
//                         borderColor: '#d9731d',
//                         borderRadius: '8px',
//                         color: 'white'
//                       }}
//                     />
//                     <Bar 
//                       dataKey="hires" 
//                       fill="#d9731d" 
//                       name="Successful Hires"
//                       radius={[4, 4, 0, 0]}
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {/* <EditRecruiterModal open={open} setOpen={setOpen} /> */}
//     </div>
//   );
// };

// export default RecruiterProfile;
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import { Mail, Phone, Building2, Pen, Globe, Briefcase, Users, BarChart2 } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

const RecruiterProfile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const jobState = useSelector((state) => state.job);
  
  // Get jobs with safe fallback
  const jobs = jobState?.jobs || [];
  const isLoading = jobState?.loading;
  const error = jobState?.error;

  // Safe calculation of stats
  const calculateStats = () => {
    if (!user) return {
      totalJobs: 0,
      totalApplicants: 0,
      successfulHires: 0,
      monthlyStats: []
    };

    const recruiterJobs = jobs.filter(job => job?.created_by === user._id) || [];
    
    const totalJobs = recruiterJobs.length;
    const totalApplicants = recruiterJobs.reduce(
      (sum, job) => sum + (job?.applicants?.length || 0), 
      0
    );
    
    const successfulHires = recruiterJobs.reduce(
      (sum, job) => sum + (job?.hiredCount || 0), 
      0
    );
    
    // Generate placeholder monthly stats
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyStats = months.map(month => ({
      name: month,
      posts: Math.floor(totalJobs / months.length),
      applicants: Math.floor(totalApplicants / months.length),
      hires: Math.floor(successfulHires / months.length)
    }));
    
    return {
      totalJobs,
      totalApplicants,
      successfulHires,
      monthlyStats
    };
  };
  
  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E67E22]"></div>
      </div>
    );
  }

  if (error) return <div className="text-red-500 p-4">Error loading data: {error}</div>;
  if (!user) return <div className="p-4">User data not available</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2C3E50] to-[#E67E22] p-6 rounded-2xl shadow-lg text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white/20">
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={user?.profile?.profilePhoto}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </Avatar>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.fullname}</h1>
              <p className="text-white/90">{user?.companyName}</p>
              {user?.profile?.title && (
                <p className="text-white/80 text-sm mt-1">{user.profile.title}</p>
              )}
            </div>
          </div>
          <Button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-white text-[#2C3E50] hover:bg-white/90">
            <Pen size={16} /> Edit Profile
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{
          title: "Total Job Posts",
          icon: <Briefcase className="h-4 w-4 text-[#E67E22]" />,
          value: stats.totalJobs,
          growth: stats.monthlyStats.length > 1
            ? `${Math.round((stats.monthlyStats.at(-1).posts / stats.monthlyStats.at(-2).posts) * 100)}%`
            : 'No trend data'
        }, {
          title: "Total Applicants",
          icon: <Users className="h-4 w-4 text-[#E67E22]" />,
          value: stats.totalApplicants,
          growth: stats.monthlyStats.length > 1
            ? `${Math.round((stats.monthlyStats.at(-1).applicants / stats.monthlyStats.at(-2).applicants) * 100)}%`
            : 'No trend data'
        }, {
          title: "Successful Hires",
          icon: <BarChart2 className="h-4 w-4 text-[#E67E22]" />,
          value: stats.successfulHires,
          growth: stats.monthlyStats.length > 1
            ? `${Math.round((stats.monthlyStats.at(-1).hires / stats.monthlyStats.at(-2).hires) * 100)}%`
            : 'No trend data'
        }].map((card, idx) => (
          <Card key={idx} className="hover:shadow-[#E67E22]/50 transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">+{card.growth} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="hover:shadow-[#E67E22]/50 transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5" /> Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#E67E22]" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#E67E22]" />
                <span>{user?.phoneNumber || "Not provided"}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-[#E67E22]/50 transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" /> Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 size={18} className="text-[#E67E22]" />
                <span>{user?.companyName}</span>
              </div>
              {user?.companyWebsite && (
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-[#E67E22]" />
                  <a
                    href={user.companyWebsite.startsWith("http") ? user.companyWebsite : `https://${user.companyWebsite}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {user.companyWebsite}
                  </a>
                </div>
              )}
              {user?.companySize && (
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-[#E67E22]" />
                  <span>{user.companySize} employees</span>
                </div>
              )}
              {user?.industry && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Industry</h4>
                  <Badge variant="outline" className="text-[#E67E22] border-[#E67E22]">
                    {user.industry}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="hover:shadow-[#E67E22]/50 transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Job Posts & Applicants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#2C3E50",
                        borderColor: "#E67E22",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Line type="monotone" dataKey="posts" stroke="#E67E22" strokeWidth={2} name="Job Posts" />
                    <Line type="monotone" dataKey="applicants" stroke="#2C3E50" strokeWidth={2} name="Applicants" />
                    <Line type="monotone" dataKey="hires" stroke="#28A745" strokeWidth={2} name="Hires" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;
