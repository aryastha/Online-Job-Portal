import React from 'react';
import Navbar from '../components/components_lite/Navbar';
import Footer from '../components/components_lite/Footer';

const PrivacyPolicy = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p className="mb-4">
            At Best Role, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you visit our website or use our job 
            portal services. Please read this policy carefully. If you do not agree with the terms of this 
            privacy policy, please do not access the site.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          <p className="mb-4">We may collect personal information that you voluntarily provide to us when you:</p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">Register for an account</li>
            <li className="mb-2">Express interest in obtaining information about us or our products</li>
            <li className="mb-2">Submit job applications</li>
            <li className="mb-2">Upload resumes or CVs</li>
            <li className="mb-2">Post job listings</li>
            <li className="mb-2">Participate in surveys or contests</li>
            <li className="mb-2">Contact us</li>
          </ul>
          
          <p className="mb-4">
            The personal information we collect may include your name, email address, phone number,
            resume/CV content, work history, education, skills, and any other information you choose
            to provide.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">We may use the information we collect for various purposes, including to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">Provide, operate, and maintain our website and services</li>
            <li className="mb-2">Connect job seekers with potential employers</li>
            <li className="mb-2">Improve, personalize, and expand our website and services</li>
            <li className="mb-2">Understand and analyze how you use our website</li>
            <li className="mb-2">Develop new products, services, features, and functionality</li>
            <li className="mb-2">Send you emails and notifications about your applications and account</li>
            <li className="mb-2">Find and prevent fraud</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
          <p className="mb-4">
            We have implemented appropriate technical and organizational security measures designed to 
            protect the security of any personal information we process. However, please also remember 
            that we cannot guarantee that the internet itself is 100% secure. Although we will do our 
            best to protect your personal information, transmission of personal information to and from 
            our site is at your own risk.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contact Us</h2>
          <p className="mb-4">
            If you have questions or concerns about this Privacy Policy, please contact us at:
            <a href="mailto:privacy@bestrole.com" className="text-blue-600 hover:text-blue-800"> privacy@bestrole.com</a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy; 