import React from 'react';
import Navbar from '../components/components_lite/Navbar';
import Footer from '../components/components_lite/Footer';

const TermsOfService = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to Best Role. By using our website and services, you agree to be bound by these 
            Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use of Services</h2>
          <p className="mb-4">
            Our platform provides job seekers and employers with tools to connect. You agree to use 
            these services only for their intended purpose and in compliance with all applicable laws 
            and regulations.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Job Seeker Terms</h3>
          <p className="mb-4">As a job seeker, you agree to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">Provide accurate and truthful information in your profile and applications</li>
            <li className="mb-2">Not misrepresent your qualifications, experience, or identity</li>
            <li className="mb-2">Not use automated methods to apply for jobs</li>
            <li className="mb-2">Respect the privacy and confidentiality of employers</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Employer Terms</h3>
          <p className="mb-4">As an employer or recruiter, you agree to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">Provide accurate information about your company and job openings</li>
            <li className="mb-2">Comply with all applicable employment and privacy laws</li>
            <li className="mb-2">Not discriminate against applicants based on protected characteristics</li>
            <li className="mb-2">Not collect or use applicant data for purposes outside the recruitment process</li>
            <li className="mb-2">Pay all applicable fees for premium services</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Account Management</h2>
          <p className="mb-4">
            You are responsible for maintaining the security of your account and password. 
            Best Role cannot and will not be liable for any loss or damage from your failure to 
            comply with this security obligation.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Content Ownership</h2>
          <p className="mb-4">
            You retain all rights to the content you post on our platform. By submitting content, 
            you grant Best Role a worldwide, non-exclusive license to use, copy, modify, and display 
            that content in connection with the services we provide.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Prohibited Activities</h2>
          <p className="mb-4">Users are prohibited from:</p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">Using the platform for any illegal purpose</li>
            <li className="mb-2">Posting fraudulent job listings or applications</li>
            <li className="mb-2">Harassing other users</li>
            <li className="mb-2">Attempting to gain unauthorized access to other accounts</li>
            <li className="mb-2">Using the platform to distribute spam or malware</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Limitation of Liability</h2>
          <p className="mb-4">
            Best Role is provided "as is" without any warranties, expressed or implied. We are not 
            responsible for the actions of users on our platform or the accuracy of job listings.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these terms at any time. We will provide notice of significant 
            changes through our website or by email.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Information</h2>
          <p className="mb-4">
            If you have questions about these Terms of Service, please contact us at:
            <a href="mailto:legal@bestrole.com" className="text-blue-600 hover:text-blue-800"> legal@bestrole.com</a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService; 