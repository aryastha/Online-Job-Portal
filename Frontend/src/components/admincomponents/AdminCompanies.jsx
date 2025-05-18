import React, { useState, useEffect } from 'react';
import Navbar from '../components_lite/Navbar';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Building2, Search, Loader2, MapPin, Phone, Mail, Globe } from 'lucide-react';
import axios from 'axios';
import { COMPANY_API_ENDPOINT } from '@/utils/data';
import { toast } from 'sonner';

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${COMPANY_API_ENDPOINT}/all`, {
        withCredentials: true,
      });
      console.log('Companies API Response:', response.data);
      if (response.data.success) {
        setCompanies(response.data.companies);
      } else {
        toast.error(response.data.message || 'Failed to fetch companies');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (company) => {
    setCompanyToDelete(company);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!companyToDelete) return;
    
    try {
      await axios.delete(`${COMPANY_API_ENDPOINT}/delete/${companyToDelete._id}`, {
        withCredentials: true,
      });
      toast.success('Company deleted successfully');
      fetchCompanies();
    } catch (error) {
      toast.error('Failed to delete company');
    } finally {
      setIsDeleteDialogOpen(false);
      setCompanyToDelete(null);
    }
  };

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#2C3E50]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#2C3E50]">Company Management</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company._id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.industry}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    {company.location}
                  </TableCell>
                  <TableCell className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {company.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {company.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Globe className="h-4 w-4" />
                      Visit
                    </a>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(company)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the company
              {companyToDelete && ` "${companyToDelete.name}"`} and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCompanies; 