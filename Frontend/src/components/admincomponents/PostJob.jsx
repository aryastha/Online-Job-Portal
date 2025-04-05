import React, { useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSingleJob } from "@/redux/jobSlice";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";

const companyArray = [];

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });

  const { companies } = useSelector((store) => store.company);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form className="p-8 max-w-4xl border border-gray-500 shadow-sm hover:shadow-xl rounded-lg">
          <div className="grid grid-cols-2 gap-5">
            <div>
              {/*Job Title  */}
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                placeholder="Enter job title"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
                onChange={changeEventHandler}
              />
            </div>
            {/* Job Description  */}
            <div>
              <Label>Description</Label>
              <Input
                name="description"
                value={input.description}
                placeholder="Enter job description"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400 "
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                placeholder="Enter job location"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Salary</Label>
              <Input
                type="number"
                name="salary"
                value={input.salary}
                placeholder="Enter job salary"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Position</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                placeholder="Enter job position"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                placeholder="Enter job requirements"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Experience</Label>
              <Input
                type="number"
                name="experience"
                value={input.experience}
                placeholder="Enter job experience"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Job Type</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                placeholder="Enter job type"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
                onChange={changeEventHandler}
              />
            </div>

            <div>

                <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              
            </div>
          </div>

          {/* Button */}
          <div className="flex items-center justify-center mt-5">
            <Button
              type="submit"
              className="w-full px-4 py-2 text-sm text-white bg-black rounded-md hover:bg-blue-600 mt-6"
            >
              Post Job
            </Button>
          </div>
          {companyArray.length === 0 && (
            <p className="text-sm text-red-600 font-semibold text-center mt-2">
              *Please Register a company to post jobs.*
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
