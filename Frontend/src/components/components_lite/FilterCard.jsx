import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { updateFilter, resetFilters } from "@/redux/jobSlice";

const FilterCard = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((store) => store.job);

  const locationOptions = [
    "Kathmandu",
    "Lalitpur",
    "Bhaktapur",
    "Remote",
    "Other",
  ];
  const jobTypeOptions = [
    "Full-time",
    "Part-time",
    "Freelance",
    "Remote",
    "Internship",
  ];
  const technologyOptions = [
    "React",
    "Node.js",
    "Python",
    "Java",
    "MongoDB",
    "MySQL",
    "AWS",
  ];
  const positionOptions = [
    "Frontend",
    "Marketing",
    "Mobile",
    "SEO",
    "Backend",
    "Fullstack",
    "DevOps",
    "Data Science",
  ];
  const postedWithinOptions = [
    { label: "Today", value: 1 },
    { label: "Last 3 days", value: 3 },
    { label: "Last 7 days", value: 7 },
    { label: "Last 30 days", value: 30 },
  ];

  const handleCheckboxChange = (filterType, value, checked) => {
    const currentValues = [...filters[filterType]];
    if (checked) {
      dispatch(updateFilter({ filterType, value: [...currentValues, value] }));
    } else {
      dispatch(
        updateFilter({
          filterType,
          value: currentValues.filter((v) => v !== value),
        })
      );
    }
  };

  const handleSliderChange = (filterType, value) => {
    dispatch(updateFilter({ filterType, value }));
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg text-gray-800">Filter Jobs</h1>
        <button
          onClick={() => dispatch(resetFilters())}
          className="text-sm text-blue-600 hover:underline"
        >
          Reset All
        </button>
      </div>

      {/* Search Bar */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          type="text"
          value={filters.searchText}
          onChange={(e) =>
            dispatch(
              updateFilter({ filterType: "searchText", value: e.target.value })
            )
          }
          placeholder="Job title, skills, company"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Experience Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Experience: {filters.experience[0]} - {filters.experience[1]} years
        </label>
        <Slider
          min={0}
          max={10}
          step={1}
          value={filters.experience}
          onValueChange={(value) => handleSliderChange("experience", value)}
          className="w-full"
        />
      </div>

      {/* Salary Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Salary: NPR {filters.salary[0].toLocaleString()} -{" "}
          {filters.salary[1].toLocaleString()}
        </label>
        <Slider
          min={0}
          max={200000}
          step={10000}
          value={filters.salary}
          onValueChange={(value) => handleSliderChange("salary", value)}
          className="w-full"
        />
      </div>

      {/* Location Checkboxes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <div className="space-y-2">
          {locationOptions.map((location) => (
            <div key={location} className="flex items-center">
              <Checkbox
                id={`location-${location}`}
                checked={filters.locations.includes(location)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("locations", location, checked)
                }
              />
              <label
                htmlFor={`location-${location}`}
                className="ml-2 text-sm text-gray-600"
              >
                {location}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Job Type Checkboxes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job Type
        </label>
        <div className="space-y-2">
          {jobTypeOptions.map((type) => (
            <div key={type} className="flex items-center">
              <Checkbox
                id={`type-${type}`}
                checked={filters.jobTypes.includes(type)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("jobTypes", type, checked)
                }
              />
              <label
                htmlFor={`type-${type}`}
                className="ml-2 text-sm text-gray-600"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Technologies Checkboxes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Technologies
        </label>
        <div className="space-y-2">
          {technologyOptions.map((tech) => (
            <div key={tech} className="flex items-center">
              <Checkbox
                id={`tech-${tech}`}
                checked={filters.technologies.includes(tech)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("technologies", tech, checked)
                }
              />
              <label
                htmlFor={`tech-${tech}`}
                className="ml-2 text-sm text-gray-600"
              >
                {tech}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Positions Checkboxes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Positions
        </label>
        <div className="space-y-2">
          {positionOptions.map((position) => (
            <div key={position} className="flex items-center">
              <Checkbox
                id={`position-${position}`}
                checked={filters.positions.includes(position)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("positions", position, checked)
                }
              />
              <label
                htmlFor={`position-${position}`}
                className="ml-2 text-sm text-gray-600"
              >
                {position}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Posted Within Radio */}
      {/* Posted Within Radio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Posted Within
        </label>
        <RadioGroup
          value={filters.postedWithin?.toString() || ""}
          onValueChange={(value) =>
            dispatch(
              updateFilter({
                filterType: "postedWithin",
                value: Number(value),
              })
            )
          }
          className="space-y-2"
        >
          {postedWithinOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value.toString()}
                id={`posted-${option.value}`}
                className="h-4 w-4 border border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor={`posted-${option.value}`}
                className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option.label}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default FilterCard;
