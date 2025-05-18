import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'Admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'Admin') {
    return null;
  }

  return children;
};

export default AdminProtectedRoute; 