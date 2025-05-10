import React, { useEffect } from 'react'
import Navbar from './Navbar';
import Header from './Header';
import Categories from './Categories';
import LatestJobs from './LatestJobs';
import Footer from './Footer';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ResumeBuilder from './ResumeBuilder';


const Home = () => {
  useGetAllJobs();

  
const {user} = useSelector((store)=>store.auth);
const navigate = useNavigate();

useEffect(()=>{
  if (user?.role === 'Recruiter'){
    navigate("/recruiter/dashboard");
  }
},[])
  
  return (
    <div>
      <Navbar />
      <Header />
      <Categories />
      <LatestJobs />
      <ResumeBuilder />
      <Footer />
    </div>
  )
}

export default Home
