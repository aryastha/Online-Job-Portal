import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableHeader,
  TableHead,
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
        <TableCaption>Recent Applied Jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allAppliedJobs.length <= 0 ? (
            // Changed from <span> to <TableRow> with full-width cell
            // This fixes the hydration error by maintaining proper table structure
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                You haven't applied for any jobs yet.
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id}>
                <TableCell>
                  {appliedJob?.createdAt?.split("T")[0] || "N/A"}
                </TableCell>
                <TableCell>{appliedJob?.job?.title || "N/A"}</TableCell>
                <TableCell>{appliedJob?.job?.company?.name || "N/A"}</TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      appliedJob?.status === "rejected"
                        ? "bg-red-500"
                        : appliedJob?.status === "accepted"
                        ? "bg-green-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {appliedJob?.status || "Pending"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobs;