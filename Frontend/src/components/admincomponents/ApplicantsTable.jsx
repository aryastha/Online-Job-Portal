import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useSelector } from "react-redux";
import { MoreHorizontal } from "lucide-react";
import axios from "axios";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";

const shortListingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);

  const statusHandler = async(status, id) =>{
    axios.defaults.withCredentials = true;
    console.log("called");
    try{
      const res = await axios.post(`${APPLICATION_API_ENDPOINT}/status/${id}/update`,
        {status}
      );
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message);
      }
    }catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent applied user</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>FullName</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {applicants &&
            applicants?.applications?.map((item) => (
              <tr key={item.id}>
                <TableCell>{item?.applicant?.fullname}</TableCell>
                <TableCell>{item?.applicant?.email}</TableCell>
                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                <TableCell>{item?.applicant?.profile?.resume?(
                  <a
                  className="text-blue-600 cursor-pointer"
                  href= {item?.applicant?.profile?.resume}
                  target= "_blank"
                  rel="noopener noreferrer"
                  >
                    Download
                  </a>
                ):(
                  <span> NA</span>
                )}
                </TableCell>
                <TableCell>{item?.applicant?.createdAt.split("T")[0]}</TableCell>
                <TableCell className="float-right cursor-pointer" >
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>

                    <PopoverContent className="w-32">
                      {shortListingStatus.map((status, index) => {
                        return (
                          <div
                          onClick= {()=> statusHandler(status, item?._id)}
                            className="flex w-fit items-center my-2 cursor-pointer text-right"
                            key={index}
                          >
                            <input
                              type="radio"
                              name="shortlisting"
                              value={status}
                            />{" "}
                            {status}
                          </div>
                        );
                      })}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </tr>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
