import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { FileText, Rocket } from 'lucide-react';

const ResumeBuilder = () => {
  return (
    <section className="bg-gradient-to-r from-[#FFF8F0] to-[#FEF4E8] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center justify-center bg-[#E67E22]/10 p-3 rounded-full mb-4">
            <FileText className="h-6 w-6 text-[#E67E22]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2C3E50] mb-3">
            Build Your Perfect Resume in Minutes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Stand out to employers with a professional resume tailored for your dream job.
            Our builder makes it easy to create, customize, and download.
          </p>
          <Link to="/resume/create">
            <Button className="bg-[#E67E22] hover:bg-[#d9731d] text-white px-6 py-3 text-sm md:text-base">
              <Rocket className="mr-2 h-4 w-4" />
              Start Building Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ResumeBuilder;