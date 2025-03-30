import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar.jsx";
import { Button } from "../ui/button.jsx";
import { ArrowLeft, Loader2, Image as ImageIcon } from "lucide-react";
import { Label } from "../ui/label.jsx";
import { Input } from "../ui/input.jsx";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "../../utils/data.js";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById.jsx";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });
  const [preview, setPreview] = useState("");
  const { singleCompany } = useSelector((store) => store.company || { singleCompany: {} });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_ENDPOINT}/update/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.status === 200 && res.data.message) {
        toast.success(res.data.message, {
          position: "top-center",
          duration: 2000,
        });
        navigate("/admin/companies");
      } else {
        throw new Error("Unexpected API response.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage, {
        position: "top-center",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: singleCompany.file || null,
      });
      if (singleCompany.logoUrl) {
        setPreview(singleCompany.logoUrl);
      }
    }
  }, [
    singleCompany?.name, 
    singleCompany?.description, 
    singleCompany?.website, 
    singleCompany?.location, 
    singleCompany?.file,
    singleCompany?.logoUrl
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/admin/companies")}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Companies</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">Company Profile Setup</h1>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Update your company information and branding
            </p>
          </div>

          <form onSubmit={submitHandler} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700 font-medium">Company Name *</Label>
                  <Input
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={changeEventHandler}
                    className="mt-1"
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Description</Label>
                  <Input
                    type="text"
                    name="description"
                    value={input.description}
                    onChange={changeEventHandler}
                    className="mt-1"
                    placeholder="Brief description about your company"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Website</Label>
                  <Input
                    type="url"
                    name="website"
                    value={input.website}
                    onChange={changeEventHandler}
                    className="mt-1"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium">Location</Label>
                  <Input
                    type="text"
                    name="location"
                    value={input.location}
                    onChange={changeEventHandler}
                    className="mt-1"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700 font-medium">Company Logo</Label>
                  <div className="mt-1 flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-100">
                      {preview ? (
                        <img 
                          src={preview} 
                          alt="Company logo preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <ImageIcon className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-xs text-gray-500 mt-1">No logo</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={changeFileHandler}
                        className="hidden"
                      />
                      <Label 
                        htmlFor="logo-upload" 
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      >
                        {input.file ? "Change Logo" : "Upload Logo"}
                      </Label>
                      <p className="mt-1 text-xs text-gray-500">
                        Recommended size: 300x300px
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800">Tips</h3>
                    <ul className="mt-2 text-xs text-blue-700 space-y-1">
                      <li>• Ensure all required fields are filled</li>
                      <li>• Use a high-quality logo for best results</li>
                      <li>• Double-check website URL format</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/companies")}
                className="mr-3"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanySetup;