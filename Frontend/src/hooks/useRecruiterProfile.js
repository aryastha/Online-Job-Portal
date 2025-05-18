import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const useRecruiterProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5004/api/user/recruiter/profile', {
                withCredentials: true
            });
            
            if (response.data.status === 'success') {
                setProfile(response.data.data);
            }
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch profile');
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            setLoading(true);
            const response = await axios.put(
                'http://localhost:5004/api/user/recruiter/profile',
                profileData,
                { withCredentials: true }
            );
            
            if (response.data.status === 'success') {
                setProfile(response.data.data);
                toast.success('Profile updated successfully');
            }
            return true;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to update profile';
            toast.error(errorMsg);
            console.error('Error updating profile:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const uploadProfileImage = async (file) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('profileImage', file);

            const response = await axios.post(
                'http://localhost:5004/api/user/recruiter/profile/image',
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            if (response.data.status === 'success') {
                setProfile(response.data.data);
                toast.success('Profile image updated successfully');
            }
            return true;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to upload image';
            toast.error(errorMsg);
            console.error('Error uploading image:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return {
        profile,
        loading,
        error,
        updateProfile,
        uploadProfileImage,
        refetch: fetchProfile
    };
};

export default useRecruiterProfile; 