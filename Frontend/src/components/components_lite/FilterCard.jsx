// import React, { useState, useEffect } from "react";
// import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// import { useDispatch } from "react-redux";
// import { setSearchedQuery } from "@/redux/jobSlice";

// const filterData = [
//   {
//     filterType: "Location",
//     array: ["Kathmandu", "Lalitpur", "Naxal", "Bhaktapur", "New Baneshwor", "Naikap", "Ekantakuna"],
//   },
//   {
//     filterType: "Technology",
//     array: ["React", "Backend", "Mobile", "Digital", "Marketing", "SEO"],
//   },
//   {
//     filterType: "Experience",
//     array: ["intern", "0-1 year", "1-3 years", "4-6 years"],
//   },
//   {
//     filterType: "Salary",
//     array: ["0-15k", "15k - 30k", "30k - 50k", "50k - 80k", "80k - 100k", "100k - 200k"],
//   },
// ];

// const FilterCard = () => {
//   const [filters, setFilters] = useState({});
//   const dispatch = useDispatch();

//   const handleChange = (filterType, value) => {
//     setFilters((prev) => ({ ...prev, [filterType]: value }));
//   };

//   useEffect(() => {
//     dispatch(setSearchedQuery(filters));
//   }, [filters]);

//   return (
//     <div className="w-full bg-white rounded-lg shadow-md p-4">
//       <h1 className="font-bold text-lg mb-3 text-gray-800">Filter Jobs</h1>
//       <hr className="border-gray-200 mb-3" />
//       {filterData.map((data, index) => (
//         <RadioGroup
//           key={index}
//           value={filters[data.filterType] || ""}
//           onValueChange={(val) => handleChange(data.filterType, val)}
//         >
//           <div className="mb-4">
//             <h2 className="font-semibold text-base mb-2 text-gray-700">{data.filterType}</h2>
//             {data.array.map((item, indx) => {
//               const itemId = `Id${index}-${indx}`;
//               return (
//                 <div key={itemId} className="flex items-center space-x-2 my-1 hover:bg-gray-50 p-1 rounded-lg transition-colors duration-200">
//                   <RadioGroupItem value={item} id={itemId} className="w-4 h-4 text-blue-600 border-2 border-gray-300" />
//                   <label htmlFor={itemId} className="text-sm text-gray-600">{item}</label>
//                 </div>
//               );
//             })}
//           </div>
//         </RadioGroup>
//       ))}
//     </div>
//   );
// };

// export default FilterCard;

import React, { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useDispatch } from "react-redux";
import { setFilters } from "@/redux/jobSlice"; // Changed from setSearchedQuery to setFilters

const filterData = [
  {
    filterType: "location",
    array: ["Kathmandu", "Lalitpur", "Bhaktapur", "Remote"],
  },
  {
    filterType: "technology",
    array: ["React", "Node", "Python", "Java", "Full Stack", "Mobile", "SEO"],
  },
  {
    filterType: "experience",
    array: ["Intern", "Entry Level", "Mid Level", "Senior Level"],
  },
  {
    filterType: "salary",
    array: ["0-15k", "15k-30k", "30k-50k", "50k-80k", "80k+"],
  },
];

const FilterCard = () => {
  const [selectedFilters, setSelectedFilters] = useState({});
  const dispatch = useDispatch();

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev, 
        [filterType]: prev[filterType] === value ? "" : value
       };
       console.log("Updated filters:", newFilters);
      return newFilters;
    });
  };

  useEffect(() => {

    dispatch(setFilters(selectedFilters)); // Dispatch the complete filters object
    
  }, [selectedFilters, dispatch]);

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <h1 className="font-bold text-lg mb-3 text-gray-800">Filter Jobs</h1>
      <hr className="border-gray-200 mb-3" />
      {filterData.map((data, index) => (
        <RadioGroup
          key={index}
          value={selectedFilters[data.filterType] || ""}
          onValueChange={(val) => handleFilterChange(data.filterType, val)}
        >
          <div className="mb-4">
            <h2 className="font-semibold text-base mb-2 text-gray-700">
              {data.filterType.charAt(0).toUpperCase() + data.filterType.slice(1)}
            </h2>
            {data.array.map((item, indx) => (
              <div key={`${data.filterType}-${indx}`} className="flex items-center space-x-2 my-1 hover:bg-gray-50 p-1 rounded-lg">
                <RadioGroupItem 
                  value={item} 
                  id={`${data.filterType}-${indx}`}
                  className="w-4 h-4 text-blue-600 border-2 border-gray-300" 
                />
                <label htmlFor={`${data.filterType}-${indx}`} className="text-sm text-gray-600">
                  {item}
                </label>
              </div>
            ))}
          </div>
        </RadioGroup>
      ))}
    </div>
  );
};

export default FilterCard;