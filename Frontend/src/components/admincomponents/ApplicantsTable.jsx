import React from "react";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";

const shortLisitngStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const {application} = useSelector((store)=> store.application)
  return (
    <div>
      <Table className="min-w-full divide-y divide-gray-200">
        <TableCaption className="text-center px-6 py-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">
              Show the latest applicants
            </span>
          </div>
        </TableCaption>

        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[60px]">Fullname</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Job Title</TableHead>
            {/* <TableHead> Company</TableHead> */}
            <TableHead className="text-right w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-200">
          <tr>
            <TableCell> Fullname</TableCell>
            <TableCell> Email</TableCell>
            <TableCell> Contact</TableCell>
            <TableCell> Applied On</TableCell>
            <TableCell> Resume</TableCell>
            <TableCell> Job Title</TableCell>
            {/* <TableCell> Company</TableCell> */}

            <TableCell className="text-right">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2 rounded-md hover:bg-gray-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2" align="end">
                  {shortLisitngStatus.map((status, index) => {
                    return (
                      <div className="mt-2" key={index}>
                        <input
                          type="radio"
                          name="shortListingStatus"
                          value={status}
                        />
                        {status}
                      </div>
                    );
                  })}
                </PopoverContent>
              </Popover>
            </TableCell>
            <TableCell className="text-right">

                
            </TableCell>
          </tr>
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
