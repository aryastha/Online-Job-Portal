import React from "react";
import Navbar from "./Navbar";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import { Pen, Mail, Contact } from "lucide-react";

const Profile = () => {
  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto bg-white border-gray-200 rounded-2xl my-5 p-8 shadow shadow-gray-500 hover:shadow-[#d9731d]">
        <div className="flex justify-between">
          <div className=" flex items-center gap-5">
            <Avatar className="cursor-pointer h-24 w-24 flex items-center justify-center rounded-full overflow-hidden border border-gray-300">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="profilepicture"
              />
            </Avatar>

            <div>
              <h1 className="font-medium text-xl"> Full Name</h1>
              <p className="text-gray-600">
                {" "}
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Reprehenderit veniam aperiam quaerat quibusdam et ducimus?
              </p>
            </div>

            <Button variant="outline" className="text-right items-center">
              <Pen />
            </Button>
          </div>
        </div>

        <div children='my-5'>
          <div className="flex items-center gap-3 my-2">
            <Mail />
            <span> aryashrestha888@gmail.com</span>
          </div>

          <div className="flex items-center gap-3 my-2">
            <Contact />
            <span> 9864831310</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
