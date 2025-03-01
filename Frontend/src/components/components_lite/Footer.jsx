import React from 'react'
import { Link } from 'react-router-dom'
import {FaFacebook, FaLinkedin, FaInstagram, FaLinkedinIn} from 'react-icons/fa';
const Footer = () => {
  return (
    <div className="bg-[#2C3E50] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Copyright Secvtion */}
                <div className="text-center md:text-left">
                    <h3 className="text-lg font-medium mb-4"> Best Role </h3>
                    <p className="text-sm text-gray-300"> 
                    © {new Date().getFullYear()} Best Role. All rights reserved. </p>

                </div>

                {/* Quick Links */}

                <div className="text-center">
                    <h3 className="text-lg font-medium mb-4"> Quick Links</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link to ="/about" className="text-sm text-gray-300 hover:text-white transition-duration-300">
                            About
                            </Link>
                        </li>

                        <li>
                            <Link to ="/about" className="text-sm text-gray-300 hover:text-white transition-duration-300">
                            Privacy Policy
                            </Link>
                        </li>

                        <li>
                            <Link to ="/about" className="text-sm text-gray-300 hover:text-white transition-duration-300">
                            Terms of Service
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Social Media Links */}
                <div className="text-center md:text-right">
                    <h3 className="text-lg font-medium mb-4">Follow Us</h3>
                    <div className="flex justify-center md:justify-end and space-x-4">
                        <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className='text-gray-300 hover:text-white transition-all duration-30'>
                            <FaFacebook size={20} />
                        </a>

                        <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className='text-gray-300 hover:text-white transition-all duration-30'>
                            <FaInstagram size={20} />
                        </a>

                        <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className='text-gray-300 hover:text-white transition-all duration-30'>
                            <FaLinkedinIn size={20} />
                        </a>


                    </div>
                </div>

            </div>
        </div>
      
    </div>
  )
}

export default Footer
