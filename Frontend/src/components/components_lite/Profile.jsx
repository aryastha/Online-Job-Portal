import React from "react";
import Navbar from "./Navbar";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Pen, Mail, Contact } from "lucide-react";
import AppliedJobs from "./AppliedJobs";

const Profile = () => {
  const isResume = true;
  const skills = ["SEO", "Keyword Research", "Google Analytics", "Wordpress"];

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto bg-white border-gray-200 rounded-2xl my-5 p-8 shadow shadow-gray-500 hover:shadow-[#d9731d]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-5">
            {/* Avatar with proper styling */}
            <div className="h-20 w-20 rounded-full overflow-hidden border border-gray-300">
              <Avatar className="h-full w-full">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="profilepicture"
                  className="w-full h-full object-cover"
                />
              </Avatar>
            </div>

            {/* User Info */}
            <div className="">
              <h1 className="font-medium text-lg">Full Name</h1>
              <p className="text-gray-600 text-justify max-w-2xl text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Asperiores quisquam adipisci facilis voluptas minima? Deserunt
                labore voluptatem sunt, dolor inventore, ratione numquam
                voluptatum iste officia sint veritatis ipsum impedit quasi?
              </p>
            </div>
        </div>

          {/* Edit Button aligned properly */}
          <Button variant="outline" className="flex items-center gap-2">
            <Pen size={16} />
            Edit
          </Button>
        </div>

        {/* Contact Details */}
        <div className="mt-5">
          <div className="flex items-center gap-3 my-2">
            <Mail size={18} />
            <span>aryashrestha888@gmail.com</span>
          </div>

          <div className="flex items-center gap-3 my-2">
            <Contact size={18} />
            <span>9864831310</span>
          </div>
        </div>

        <div>
          <h2 className="text-medium font-bold mt-5"> Skills </h2>
          <div className="flex items-center gap-5 mt-4">
            {skills.length !== 0 ? (
              skills.map((item, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="p-2 font-medium"
                >
                  {" "}
                  {item}{" "}
                </Badge>
              ))
            ) : (
              <span className=""> NA</span>
            )}
          </div>
        </div>

        {/* Resume */}
        <div>
          <h2 className="text-medium font-bold mt-5"> Resume</h2>
          <div>
            {isResume ? (
              <a
                target="_blank"
                href="https://www.youtube.com/watch?v=3LXrE1Cs5bk&t=22141s"
              >
                <Button
                  variant="outline"
                  className="p-3 mt-4 bg-[#2C3E50] text-white hover:bg-[#394f66] hover:text-white"
                >
                  {" "}
                  Download CV
                </Button>
              </a>
            ) : (
              <span> No Resume Found</span>
            )}
          </div>
        </div>
        {/* Application Table */}
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl mt-5">
          <h2 className="text-md font-bold"> Applied Jobs</h2>
          <AppliedJobs />
      </div>
    </div>
  );
};

export default Profile;
