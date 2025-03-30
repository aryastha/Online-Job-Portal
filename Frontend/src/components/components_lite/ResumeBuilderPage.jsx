import React, { useState, useRef } from 'react';
import Navbar from './Navbar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { RESUMES_API_ENDPOINT } from '@/utils/data';

const ResumeBuilderPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    summary: '',
    education: '',
    experience: '',
    skills: '',
    photo: null
  });
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }

      setFormData(prev => ({ ...prev, photo: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
    setPhotoPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!formData.fullName) {
      toast.error('Please enter your full name');
      return;
    }

    setLoading(true);
    setDownloadProgress(0);

    try {
      const formDataToSend = new FormData();
      // for (const key in formData) {
      //   if (formData[key] !== null) {
      //     formDataToSend.append(key, formData[key]);
      //   }
      // }

       // Append all text fields as before
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('summary', formData.summary);
    formDataToSend.append('education', formData.education);
    formDataToSend.append('experience', formData.experience);
    formDataToSend.append('skills', formData.skills);
    
    // CHANGE THIS - Append photo with field name 'file' instead of 'photo'
    if (formData.photo) {
      formDataToSend.append('file', formData.photo); // Changed from 'photo' to 'file'
    }


      const response = await axios.post(`${RESUMES_API_ENDPOINT}/`, formDataToSend, { 
        responseType: 'blob',
        // headers: { 'Content-Type': 'multipart/form-data' ,
        // },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setDownloadProgress(percentCompleted);
        }
      });

      // Extract filename from headers or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'resume.pdf';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) filename = filenameMatch[1];
      }

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
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
        setDownloadProgress(0);
        toast.success('Resume downloaded successfully!');
      }, 100);

    } catch (error) {
      console.error('Error:', error);
      toast.error(
        error.response?.data?.message || 
        'Failed to generate resume. Please try again.'
      );
      setLoading(false);
      setDownloadProgress(0);

      // Improved error handling
    if (error.response) {
      if (error.response.status === 401) {
        toast.error('Please login to generate a resume');
        navigate('/login');  // Redirect to login if unauthorized
      } else {
        toast.error(
          error.response.data?.message || 
          'Failed to generate resume. Please try again.'
        );
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }
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
                  {photoPreview ? 'Change Photo' : 'Upload Photo'}
                </Label>
                <p className="text-xs text-gray-500 mt-1">JPG or PNG, max 2MB</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
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
          </div>

          <div>
            <Label className="text-[#2C3E50]">Professional Summary</Label>
            <Textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={4}
              placeholder="Briefly describe your professional background and skills"
            />
          </div>

          <div>
            <Label className="text-[#2C3E50]">Work Experience</Label>
            <Textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows={4}
              placeholder="Include your job history with company names, positions, and dates"
            />
          </div>

          <div>
            <Label className="text-[#2C3E50]">Education</Label>
            <Textarea
              name="education"
              value={formData.education}
              onChange={handleChange}
              rows={3}
              placeholder="List your degrees, certifications, and institutions"
            />
          </div>

          <div>
            <Label className="text-[#2C3E50]">Skills</Label>
            <Input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Separate skills with commas (e.g., JavaScript, React, Project Management)"
            />
          </div>

          {/* Progress Bar */}
          {downloadProgress > 0 && downloadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-[#E67E22] h-2.5 rounded-full" 
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/profile')}
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
                'Save & Download'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderPage;