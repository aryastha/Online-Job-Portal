import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

const Category = [
  "Full Stack Developer",
  "Backend Developer",
  "Project Manager",
  "Frontend Developer",
  "Mobile Developer",
  "UI/UX Designer",
  "Data Scientist",
  "QA Engineer",
  "DevOps Engineer",
  "SEO Executive",
  "Web Developer",
  "Digital Marketer",
  "Social Media Manager",
  "Content Writer",
  "Graphic Designer",
];

const Categories = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) =>{
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  }

  return (
    <div className="bg-gradient-to-r from-[#FF7F50] to-[#FF6347] py-10">
      <div className="text-center ">
        <h1 className="text-2xl font-semibold text-white mb-2">
          Explore Career Categories
        </h1>
        <p className="text-lg text-white font-light mb-4">
          Find your next opportunity in our carefully curated categories.
        </p>
      </div>
      <Carousel className="w-full max-w-2xl mx-auto">
        <CarouselContent className="space-x-5">
          {Category.map((category, index) => {
            return (
              <CarouselItem 
              key={index }
              className="flex justify-center items-center md:basis-1/3 lg:basis-1/3 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                {/* <div className="text-center">
                  <div
                  className="font-semibold text-[#2C3E50] p-2">{category}</div>
                </div> */}
                <Button
                onClick= {() => searchJobHandler(category)}
                variant="ghost"
                className="ont-semibold text-[#2C3E50] hover:bg-white">
                  {category}
                </Button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="text-[#FF6347] hover:text-[#FF7F50] transition duration-300" />
        <CarouselNext className="text-[#FF6347] hover:text-[#FF7F50] transition duration-300" />
      </Carousel>
    </div>
  );
};

export default Categories;
