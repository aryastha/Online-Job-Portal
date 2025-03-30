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
import { Button } from "../ui/button";
import { Edit2, MoreHorizontal, Globe, MapPin } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useSelector } from "react-redux";

const CompanyTable = () => {

  const {companies} = useSelector((store)=> store.company);
  // const companies = [
  //   {
  //     _id: "1",
  //     name: "TechNova Solutions",
  //     description: "Innovative software development company specializing in AI solutions",
  //     website: "https://technova.com",
  //     location: "San Francisco, CA",
  //     logo: "",
  //     createdAt: "2023-05-15T10:00:00Z",
  //     userId: ["user1"]
  //   },
  //   {
  //     _id: "2",
  //     name: "GreenEarth Organics",
  //     description: "Sustainable organic food production and distribution",
  //     website: "https://greenearth.org",
  //     location: "Portland, OR",
  //     logo: "https://example.com/logos/greenearth.png",
  //     createdAt: "2023-02-20T14:30:00Z",
  //     userId: ["user2"]
  //   },
  //   {
  //     _id: "3",
  //     name: "UrbanSpace Design",
  //     description: "Modern architectural firm focused on urban spaces",
  //     website: "",
  //     location: "New York, NY",
  //     logo: "",
  //     createdAt: "2023-07-01T09:15:00Z",
  //     userId: ["user3", "user4"]
  //   },
  //   {
  //     _id: "4",
  //     name: "HealthPlus Medical",
  //     description: "Healthcare provider with nationwide clinics",
  //     website: "https://healthplus.net",
  //     location: "Chicago, IL",
  //     logo: "",
  //     createdAt: "2023-01-10T16:45:00Z",
  //     userId: ["user5"]
  //   }
  // ];

  return (
    <Table className="min-w-full">
      <TableCaption className="text-left px-4 py-3 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <span>Showing {companies.length} companies</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>
      </TableCaption>
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead className="w-[60px]">Logo</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Website</TableHead>
          <TableHead>Added</TableHead>
          <TableHead className="text-right w-[50px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>

        {/* Company Data */}
        {companies.map((company) => (
          <TableRow key={company._id} className="hover:bg-gray-50">
            {/* Logo */}
            <TableCell>
              <Avatar className="h-9 w-9">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} />
                ) : (
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                    {company.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
            </TableCell>

            {/* Company Name & Description */}
            <TableCell>
              <div className="font-medium">{company.name}</div>
              <div className="text-sm text-gray-500 line-clamp-1">
                {company.description}
              </div>
            </TableCell>

            {/* Location */}
            <TableCell>
              {company.location && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  {company.location}
                </div>
              )}
            </TableCell>

            {/* Website */}
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
                <span className="text-gray-400 text-sm">Not provided</span>
              )}
            </TableCell>

            {/* Created At */}
            <TableCell>
              <div className="text-sm text-gray-500">
                {new Date(company.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </TableCell>

            {/* Actions */}
            <TableCell className="text-right">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2" align="end">
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start">
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
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