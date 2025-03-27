import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Edit2, MoreHorizontal, Trash2, Eye } from "lucide-react";

const CompanyTable = () => {
  // Sample data - replace with your actual data
  const companies = [
    {
      id: 1,
      name: "BakeandMunch",
      logo: "",
      date: "04/08/2003",
      industry: "Food & Beverage",
      employees: "50-100"
    },
    {
      id: 2,
      name: "TechNova",
      logo: "",
      date: "12/05/2022",
      industry: "Information Technology",
      employees: "200-500"
    },
    {
      id: 3,
      name: "GreenEarth",
      logo: "",
      date: "22/11/2021",
      industry: "Environmental Services",
      employees: "100-200"
    }
  ];

  return (
    <Table>
      <TableCaption className="text-left p-4 bg-gray-50 border-b">
        Showing {companies.length} registered companies
      </TableCaption>
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead className="w-[100px]">Logo</TableHead>
          <TableHead>Company Name</TableHead>
          <TableHead>Industry</TableHead>
          <TableHead>Employees</TableHead>
          <TableHead>Registered</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {companies.map((company) => (
          <TableRow key={company.id} className="hover:bg-gray-50">
            <TableCell>
              <Avatar className="h-10 w-10">
                {company.logo ? (
                  <AvatarImage src={company.logo} alt={`${company.name} logo`} />
                ) : (
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 font-medium">
                    {company.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
            </TableCell>
            <TableCell className="font-medium">{company.name}</TableCell>
            <TableCell>{company.industry}</TableCell>
            <TableCell>{company.employees}</TableCell>
            <TableCell>{company.date}</TableCell>
            <TableCell className="text-right">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" align="end">
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CompanyTable;