import React, { useState, useRef } from "react";
import Navbar from "./Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Upload, X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { RESUMES_API_ENDPOINT } from "@/utils/data";

const ResumeBuilderPage = () => {
  // Form data structure
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    summary: "",
    skills: [],
    photo: null,
  });

  const [workExperiences, setWorkExperiences] = useState([
    {
      id: Date.now(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  ]);

  const [educations, setEducations] = useState([
    {
      id: Date.now(),
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      achievements: "",
    },
  ]);

  const [skillInput, setSkillInput] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const navigate = useNavigate();

  // Handle basic form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Work Experience Handlers
  const handleWorkExperienceChange = (id, field, value) => {
    setWorkExperiences((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const addWorkExperience = () => {
    setWorkExperiences((prev) => [
      ...prev,
      {
        id: Date.now(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
        current: false,
      },
    ]);
  };

  const removeWorkExperience = (id) => {
    if (workExperiences.length > 1) {
      setWorkExperiences((prev) => prev.filter((exp) => exp.id !== id));
    } else {
      toast.info("You need at least one work experience entry");
    }
  };

  // Education Handlers
  const handleEducationChange = (id, field, value) => {
    setEducations((prev) =>
      prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  const addEducation = () => {
    setEducations((prev) => [
      ...prev,
      {
        id: Date.now(),
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        achievements: "",
      },
    ]);
  };

  const removeEducation = (id) => {
    if (educations.length > 1) {
      setEducations((prev) => prev.filter((edu) => edu.id !== id));
    } else {
      toast.info("You need at least one education entry");
    }
  };

  // Skills Handlers
  const handleSkillAdd = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // Photo Handlers
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      setFormData((prev) => ({ ...prev, photo: file }));

      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
    setPhotoPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Submit Handler (updated to handle new structure)
  const handleSubmit = async () => {
    if (!formData.fullName) {
      toast.error("Please enter your full name");
      return;
    }

    setLoading(true);
    setDownloadProgress(0);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("summary", formData.summary);

      // Append arrays as JSON strings
      formDataToSend.append("skills", JSON.stringify(formData.skills));
      formDataToSend.append("workExperiences", JSON.stringify(workExperiences));
      formDataToSend.append("educations", JSON.stringify(educations));

      //Append the photo if exists
      if (formData.photo) {
        formDataToSend.append("file", formData.photo);
      }

      const response = await axios.post(
        `${RESUMES_API_ENDPOINT}/`,
        formDataToSend,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/pdf",
          },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setDownloadProgress(percentCompleted);
          },
        }
      );

      //handle the pdf download
      const contentDisposition = response.headers["content-disposition"];
      let filename = "resume.pdf";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) filename = filenameMatch[1];
      }

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        link.remove();
        window.URL.revokeObjectURL(url);
        setLoading(false);
        setDownloadProgress(0);
        toast.success("Resume downloaded successfully!");
      }, 100);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to generate resume. Please try again."
      );
      setLoading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-[#2C3E50] hover:bg-[#E67E22]/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-[#2C3E50]">Resume Builder</h1>
        </div>

        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {/* Photo Upload Section */}
          <div className="flex flex-col items-start gap-4">
            <Label className="text-[#2C3E50]">Profile Photo (Optional)</Label>
            <div className="flex items-center gap-4">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="h-24 w-24 rounded-full object-cover border-2 border-[#E67E22]/30"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200 hover:bg-gray-100"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <Upload className="h-6 w-6 text-gray-400" />
                </div>
              )}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="hidden"
                  id="photo-upload"
                />
                <Label
                  htmlFor="photo-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#E67E22]/10 text-[#E67E22] rounded-md hover:bg-[#E67E22]/20"
                >
                  <Upload className="h-4 w-4" />
                  {photoPreview ? "Change Photo" : "Upload Photo"}
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  JPG or PNG, max 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-[#2C3E50]">Full Name *</Label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label className="text-[#2C3E50]">Email *</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label className="text-[#2C3E50]">Phone</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <Label className="text-[#2C3E50]">Professional Summary</Label>
            <Textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={4}
              placeholder="Briefly describe your professional background, skills, and achievements"
            />
          </div>

          {/* Work Experience Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="text-[#2C3E50] text-lg">Work Experience</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addWorkExperience}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Experience
              </Button>
            </div>

            {workExperiences.map((exp, index) => (
              <div key={exp.id} className="mb-6 p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Company *</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          exp.id,
                          "company",
                          e.target.value
                        )
                      }
                      placeholder="Company name"
                      required
                    />
                  </div>
                  <div>
                    <Label>Position *</Label>
                    <Input
                      value={exp.position}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          exp.id,
                          "position",
                          e.target.value
                        )
                      }
                      placeholder="Your job title"
                      required
                    />
                  </div>
                  <div>
                    <Label>Start Date *</Label>
                    <Input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          exp.id,
                          "startDate",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          exp.id,
                          "endDate",
                          e.target.value
                        )
                      }
                      disabled={exp.current}
                    />
                    <div className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            exp.id,
                            "current",
                            e.target.checked
                          )
                        }
                        className="mr-2"
                      />
                      <Label htmlFor={`current-${exp.id}`}>
                        I currently work here
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <Label>Description</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) =>
                      handleWorkExperienceChange(
                        exp.id,
                        "description",
                        e.target.value
                      )
                    }
                    rows={3}
                    placeholder="Describe your responsibilities and achievements"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWorkExperience(exp.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Education Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="text-[#2C3E50] text-lg">Education</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEducation}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Education
              </Button>
            </div>

            {educations.map((edu, index) => (
              <div key={edu.id} className="mb-6 p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Institution *</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) =>
                        handleEducationChange(
                          edu.id,
                          "institution",
                          e.target.value
                        )
                      }
                      placeholder="School/University name"
                      required
                    />
                  </div>
                  <div>
                    <Label>Degree *</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) =>
                        handleEducationChange(edu.id, "degree", e.target.value)
                      }
                      placeholder="Degree/Certificate"
                      required
                    />
                  </div>
                  <div>
                    <Label>Field of Study</Label>
                    <Input
                      value={edu.fieldOfStudy}
                      onChange={(e) =>
                        handleEducationChange(
                          edu.id,
                          "fieldOfStudy",
                          e.target.value
                        )
                      }
                      placeholder="Major/Field"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={edu.startDate}
                        onChange={(e) =>
                          handleEducationChange(
                            edu.id,
                            "startDate",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={edu.endDate}
                        onChange={(e) =>
                          handleEducationChange(
                            edu.id,
                            "endDate",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <Label>Achievements</Label>
                  <Textarea
                    value={edu.achievements}
                    onChange={(e) =>
                      handleEducationChange(
                        edu.id,
                        "achievements",
                        e.target.value
                      )
                    }
                    rows={2}
                    placeholder="Honors, awards, or notable achievements"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(edu.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Skills Section */}
          <div>
            <Label className="text-[#2C3E50]">Skills</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                >
                  <span className="text-sm">{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleSkillRemove(skill)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill"
                onKeyDown={(e) => e.key === "Enter" && handleSkillAdd()}
              />
              <Button type="button" variant="outline" onClick={handleSkillAdd}>
                Add
              </Button>
            </div>
          </div>

          {/* Submit Section */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/profile")}
              className="border-[#2C3E50] text-[#2C3E50]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#E67E22] hover:bg-[#d9731d]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {downloadProgress}%
                </>
              ) : (
                "Save & Download"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderPage;
