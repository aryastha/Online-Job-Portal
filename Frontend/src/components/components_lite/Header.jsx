import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { setSearchedQuery} from "@/redux/jobSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const Header = () => {

  const [query, setQuery] =useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () =>{
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  }

  return (
    <div className="px-4">
      <div className="flex flex-col my-10 gap-6 text-center">
        {/* Heading */}
        <h2 className="font-bold text-6xl text-[#2C3E50] leading-tight">
          Find Your{" "}
          <span className="bg-gradient-to-r from-[#F39C12] to-[#E67E22] text-transparent bg-clip-text">
            Best Role!
          </span>{" "}
          <br className="my-6" />
          Where Your Career Takes Off
        </h2>

        {/* Paragraph */}
        <p className="text-[#2C3E50] text-lg md:text-xl font-medium leading-relaxed tracking-wide">
          Join{" "}
          <span className="font-bold text-[#F39C12]">50,000+</span> professionals
          who found their dream job through Best Role!<br />
            Trusted by{" "}
            <span className=" font-bold bg-gradient-to-r from-[#F39C12] to-[#E67E22] text-transparent bg-clip-text">
              1,500+
            top companies
          </span>{" "}
          hiring now!
        </p>
 
        <div className="flex w-[40%] shadow-lg border border-gray-300 rounded-full items-center mx-auto pl-4 ">
          <input
          onChange = {(e)=>setQuery(e.target.value)}
          className="outline-none border-non w-full"
          type="text"
          placeholder="Find your best Job"
          />
          <Button onClick = {searchJobHandler}
          className="rounded-r-full bg-[#2C3E50] " >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
