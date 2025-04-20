import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal, Globe, MapPin, Calendar, Briefcase, Trash2 } from "lucide-react"; // Added Trash2 icon
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  const navigate = useNavigate();
  const [filterCompany, setFilterCompany] = useState(companies);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (companies) {
      setIsLoading(false);
      const filteredCompany = companies.filter((company) => {
        if (!searchCompanyByText) return true;
        return company.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
      });
      setFilterCompany(filteredCompany);
    }
  }, [companies, searchCompanyByText]);

  // Delete company function
  const handleDeleteCompany = async (companyId) => {
    try {
      
      setFilterCompany(filterCompany.filter(company => company._id !== companyId));
      console.log("Company deleted:", companyId);
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!companies || companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Briefcase className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No companies found</h3>
        <p className="text-sm text-gray-500">Get started by adding your first company</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableCaption className="text-left px-6 py-3 bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">
              Showing {filterCompany.length} of {companies.length} companies
            </span>
          </div>
        </TableCaption>
        
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[60px]">Logo</TableHead>
            <TableHead className="min-w-[200px]">Company</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-200">
          {filterCompany.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex flex-col items-center justify-center">
                  <Briefcase className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">No companies match your search</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filterCompany.map((company) => (
              <TableRow key={company._id} className="hover:bg-gray-50">
                <TableCell>
                  <Avatar className="h-9 w-9">
                    {company.logo ? (
                      <AvatarImage src={company.logo} alt={company.name} />
                    ) : (
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                        {company.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </TableCell>

                <TableCell>
                  <div className="font-medium">{company.name}</div>
                  <div className="text-sm text-gray-500 line-clamp-1">
                    {company.description || "No description"}
                  </div>
                </TableCell>

                <TableCell>
                  {company.location ? (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      {company.location}
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-gray-400">
                      Not specified
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  {company.website ? (
                    <a
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline text-sm"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      {company.website.replace(/(^\w+:|^)\/\//, '').split('/')[0]}
                    </a>
                  ) : (
                    <Badge variant="outline" className="text-gray-400">
                      Not provided
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {new Date(company.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-2 rounded-md hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-2" align="end">
                      <div className="space-y-1">
                        <div
                          onClick={() => navigate(`/admin/companies/${company._id}`)}
                          className="flex items-center gap-2 w-full p-2 text-sm hover:bg-gray-100 rounded cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span>Edit</span>
                        </div>
                        
                        <div
                          onClick={() => handleDeleteCompany(company._id)}
                          className="flex items-center gap-2 w-full p-2 text-sm hover:bg-gray-100 rounded cursor-pointer text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;