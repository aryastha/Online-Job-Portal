import React, { useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "@/utils/data";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { setLoading } from "@/redux/authSlice";
const CompanySetup = () => {
  const [loading, setLoading] = useState();

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  const params = useParams();
  // console.log(params);

  const navigate = useNavigate();

  const changeEventHandler = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value });
  };

  const changeFileHandler = (event) => {
    const file = event.target.files?.[0];
    setInput({ ...input, file: event.target.files[0] });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    console.log(input);
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("file", input.file);
    }
    console.log(
      input.name,
      input.description,
      input.website,
      input.location,
      input.file
    );

    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_ENDPOINT}/update/${params.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto my-10">
        <form onSubmit={submitHandler}>
          <div className="flex items-center gap-5 p-8 justify-between">
            <Button
              onClick={() => navigate("/admin/companies")}
              className="flex items-center gap-2 text-gray-600 font-semibold"
              variant="outline"
            >
              <ArrowLeft />
              <span> Back</span>
            </Button>
            <h1 className="text-[#2C3E50] font-bold"> Company Setup</h1>
          </div>
          {/* Company Name */}
          <div className="grid grid-cols-2 gap-4 my-2">
            <Label> Company Name</Label>
            <Input
              type="text"
              name="name"
              value={input.name}
              onChange={changeEventHandler}
            ></Input>
          </div>
          {/* Company Description */}
          <div className="grid grid-cols-2 gap-4 my-2">
            <Label>Company Description</Label>
            <Input
              type="text"
              name="description"
              value={input.description}
              onChange={changeEventHandler}
            ></Input>
          </div>

          {/* Company Website */}
          <div className="grid grid-cols-2 gap-4 my-2">
            <Label> Company Website</Label>
            <Input
              type="text"
              name="website"
              value={input.website}
              onChange={changeEventHandler}
            ></Input>
          </div>

          {/*Company Location  */}

          <div className="grid grid-cols-2 gap-4 my-2">
            <Label> Company Location</Label>
            <Input
              type="text"
              name="location"
              value={input.location}
              onChange={changeEventHandler}
            ></Input>
          </div>
          {/* Company Logo */}
          <div className="grid grid-cols-2 gap-4 my-2">
            <Label> Company Logo </Label>
            <Input
              type="file"
              name="file"
              accept="image/*"
              onChange={changeFileHandler}
            ></Input>
          </div>

          <Button type="submit" className="w-full mt-5 bg-[#2C3E50] ">
            {" "}
            Update{" "}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
