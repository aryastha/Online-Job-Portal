import React from "react";
import Navbar from "./Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import { Pen } from "lucide-react";

const Profile = () => {
  return (
    <div>
      <Navbar />
      <div className="mx-w-4xl max-auto bg-white border border-gray-300 rounded-2xl my-5 p-8 shadow shadow-grey-4 hover:shadow-[#E67E22]">
        <div classsName="flex justify-between">
          <div className="flex gap-4 items-center">
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
         
            <h1 className="font-medium text-[#2C3E50]">Arya Shrestha</h1>
            <div className="my-4 flex justify-between">
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            </p>
          </div>

          <Button
            onClick={() => Setopen(true)}
            variant="outline"
            className="text-right"
          >
            <Pen />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
