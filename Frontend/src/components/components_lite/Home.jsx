import React from 'react'
import Navbar from './Navbar';
import Header from './Header';
import Categories from './Categories';
import LatestJobs from './LatestJobs';
import Footer from './Footer';
import useGetAllJobs from '../hooks/useGetAllJobs';
import { useSelector } from 'react-redux';

const Home = () => {
  useGetAllJobs();
  const jobs = useSelector((state) => state.job?.allJobs || []);
  console.log("Jobs in Home:", jobs);

  
  return (
    <div>
      <Navbar />
      <Header />
      <Categories />
      <LatestJobs />
      <Footer />
    </div>
  )
}

export default Home
