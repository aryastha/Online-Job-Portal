import React from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const filterData = [
  {
    filterType: "Location",
    array: [
      "Kathmandu",
      "Lalitpur",
      "Naxal",
      "Bhaktapur",
      "New Baneshwor",
      "Naikap",
      "Ekantakuna",
    ],
  },
  {
    filterType: "Technology",
    array: [
      "React",
      "Backend",
      "Mobile",
      "Digital",
      "Marketing",
      "SEO",
    ],
  },
  {
    filterType: "Experience",
    array: ["intern", "0-1 year", "1-3 years", "4-6 years"],
  },
  {
    filterType: "Salary",
    array: [
      "0-15k",
      "15k - 30k",
      "30k - 50k",
      "50k - 80k",
      "80k - 100k",
      "100k - 200k",
    ],
  },
];

const FilterCard = () => {
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <h1 className="font-bold text-lg mb-3 text-gray-800">Filter Jobs</h1>
      <hr className="border-gray-200 mb-3" />
      <RadioGroup>
        {filterData.map((data, index) => (
          <div key={index} className="mb-4">
            <h2 className="font-semibold text-base mb-2 text-gray-700">
              {data.filterType}
            </h2>
            {data.array.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 my-1 hover:bg-gray-50 p-1 rounded-lg transition-colors duration-200"
              >
                <RadioGroupItem
                  value={item}
                  className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-600">{item}</label>
              </div>
            ))}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;