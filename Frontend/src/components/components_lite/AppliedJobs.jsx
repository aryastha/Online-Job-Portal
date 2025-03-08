import React from 'react'
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow, TableCell } from '../ui/table'
import { Badge } from "../ui/badge";
const AppliedJobs = () => {
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
            {[1,2,3,4,5].map((job, index)=>(
                <TableRow key = {index}>
                    <TableCell> 2022-01-01 </TableCell>
                    <TableCell> Software Engineer </TableCell>
                    <TableCell> Google </TableCell>
                    <TableCell> <Badge> Accepted </Badge>  </TableCell>
                </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AppliedJobs
