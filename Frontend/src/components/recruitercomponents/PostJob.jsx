import React, { useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, X } from "lucide-react";

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: [],
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: "",
    companyId: "",
  });

  const [newRequirement, setNewRequirement] = useState("");
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany._id });
  };

  const addRequirement = () => {
    if (newRequirement.trim() === "") return;
    setInput({
      ...input,
      requirements: [...input.requirements, newRequirement.trim()],
    });
    setNewRequirement("");
  };

  const removeRequirement = (index) => {
    const updatedRequirements = input.requirements.filter((_, i) => i !== index);
    setInput({ ...input, requirements: updatedRequirements });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Prepare data for backend
      const payload = {
        ...input,
        requirements: input.requirements.join(","), // Convert array to comma-separated string
        experience: input.experience.toString(), // Ensure string type
        position: input.position.toString(), // Ensure string type
      };

      const res = await axios.post(`${JOB_API_ENDPOINT}/post`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/recruiter/jobs");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Post a New Job
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below to create a new job posting
            </p>
          </div>
          
          <form onSubmit={submitHandler} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div>
                <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </Label>
                <Input
                  id="title"
                  type="text"
                  name="title"
                  value={input.title}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full"
                  onChange={changeEventHandler}
                  required
                />
              </div>

              {/* Company Selector */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </Label>
                {companies.length > 0 ? (
                  <Select onValueChange={selectChangeHandler}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {companies.map((company) => (
                          <SelectItem
                            key={company._id}
                            value={company.name.toLowerCase()}
                          >
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-red-600">
                    No companies available. Please register a company first.
                  </p>
                )}
              </div>

              {/* Job Description */}
              <div className="md:col-span-2">
                <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description *
                </Label>
                <textarea
                  id="description"
                  name="description"
                  value={input.description}
                  placeholder="Describe the job responsibilities and expectations"
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                  onChange={changeEventHandler}
                  required
                />
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </Label>
                <Input
                  id="location"
                  type="text"
                  name="location"
                  value={input.location}
                  placeholder="e.g. Kathmandu or Remote"
                  className="w-full"
                  onChange={changeEventHandler}
                  required
                />
              </div>

              {/* Salary */}
              <div>
                <Label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                  Salary (NRS)
                </Label>
                <Input
                  id="salary"
                  type="text"  // Changed to text to allow free-form input
                  name="salary"
                  value={input.salary}
                  placeholder="e.g. 50,000"
                  className="w-full"
                  onChange={changeEventHandler}
                />
              </div>

              {/* Job Type */}
              <div>
                <Label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type *
                </Label>
                <Input
                  id="jobType"
                  type="text"
                  name="jobType"
                  value={input.jobType}
                  placeholder="e.g. Full-time, Contract"
                  className="w-full"
                  onChange={changeEventHandler}
                  required
                />
              </div>

              {/* Experience */}
              <div>
                <Label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (years)
                </Label>
                <Input
                  id="experience"
                  type="text"  // Changed to text to allow free-form input
                  name="experience"
                  value={input.experience}
                  placeholder="e.g. 2+ or 3-5"
                  className="w-full"
                  onChange={changeEventHandler}
                />
              </div>

              {/* Position */}
              <div>
                <Label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                  Open Positions
                </Label>
                <Input
                  id="position"
                  type="text"  // Changed to text to allow free-form input
                  name="position"
                  value={input.position}
                  placeholder="Number of openings"
                  className="w-full"
                  onChange={changeEventHandler}
                />
              </div>

              {/* Requirements */}
              <div className="md:col-span-2">
                <Label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Enter a requirement"
                      className="flex-1"
                      onKeyDown={(e) => e.key === "Enter" && addRequirement()}
                    />
                    <Button
                      type="button"
                      onClick={addRequirement}
                      variant="outline"
                      className="px-3"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {input.requirements.length > 0 && (
                    <div className="border rounded-md divide-y">
                      {input.requirements.map((req, index) => (
                        <div key={index} className="flex items-center justify-between px-3 py-2">
                          <span>{req}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRequirement(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                className="mr-3"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || companies.length === 0}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Job"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;