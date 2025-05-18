import React from 'react';
import Navbar from '../components/components_lite/Navbar';
import Footer from '../components/components_lite/Footer';

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">About Best Role</h1>
        
        <div className="prose max-w-none">
          <p className="mb-4">
            Best Role is a leading job portal dedicated to connecting talented professionals with 
            top employers across various industries. Founded in 2023, we've quickly established ourselves 
            as a trusted platform for job seekers and recruiters alike.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="mb-4">
            Our mission is to streamline the recruitment process by providing a user-friendly platform 
            that empowers job seekers to showcase their skills and helps employers find the perfect 
            candidates for their open positions.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">What Sets Us Apart</h2>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">Advanced matching algorithms that connect candidates with suitable job opportunities</li>
            <li className="mb-2">Comprehensive recruiter dashboard with powerful analytics tools</li>
            <li className="mb-2">User-friendly interface designed for both job seekers and recruiters</li>
            <li className="mb-2">Transparent application process with real-time status updates</li>
            <li className="mb-2">Dedicated customer support to assist with any questions or concerns</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
          <p className="mb-4">
            Best Role is powered by a diverse team of experts in recruitment, technology, and user experience design. 
            Our collective experience spans decades across multiple industries, allowing us to create a platform 
            that truly understands the needs of both job seekers and employers.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Get in Touch</h2>
          <p className="mb-4">
            Have questions or feedback? We'd love to hear from you! Contact us at 
            <a href="mailto:contact@bestrole.com" className="text-blue-600 hover:text-blue-800"> contact@bestrole.com</a>.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About; 