import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
const AppliedJobs = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);
  return (
    <div>
      <Table>
        <TableCaption> Recent Applied Jobs. </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead> Date </TableHead>
            <TableHead> Job Title </TableHead>
            <TableHead> Company </TableHead>
            <TableHead> Status </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allAppliedJobs.length <=0 ?( <span> You havent applied for the jobs yet.</span> ):
          allAppliedJobs.map((appliedJob) => (
            <TableRow key={appliedJob._id}>
              <TableCell>{appliedJob?.createdAt.split("T")[0]}</TableCell>
              <TableCell> {appliedJob?.job?.title} </TableCell>
              <TableCell> {appliedJob?.job?.company?.name} </TableCell>
              <TableCell>
                {" "}
                <Badge
                className= {`${
                    appliedJob?.status === "rejected"
                    ? "bg-red-500"
                    :appliedJob?.status === "accepted"
                    ? "bg-green-600"
                    :"bg-gray-500"
                  }`}
                >{appliedJob?.status}</Badge>{" "}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default AppliedJobs;
