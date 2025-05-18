import React, { useState, useEffect } from 'react';
import Navbar from '../components_lite/Navbar';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
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
import { Badge } from '../ui/badge';
import { Shield, UserPlus, UserMinus, Search, Loader2 } from 'lucide-react';
import axios from 'axios';
import { USER_API_ENDPOINT } from '@/utils/data';
import { toast } from 'sonner';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Add effect to handle URL parameters
  useEffect(() => {
    const roleFromUrl = searchParams.get('role');
    if (roleFromUrl) {
      setRoleFilter(roleFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchUsers();
  }, []);

  //effect to log when role filter changes
  useEffect(() => {
  }, [roleFilter]);

  // Add this function to handle role changes
  const handleRoleChange = (value) => {
    setRoleFilter(value);
    // Update URL when role changes
    if (value === 'all') {
      navigate('/admin/users');
    } else {
      navigate(`/admin/users?role=${value}`);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${USER_API_ENDPOINT}/all-users`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    try {
      await axios.delete(`${USER_API_ENDPOINT}/delete/${userToDelete._id}`, {
        withCredentials: true,
      });
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Update the role matching logic to handle 'all' value
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    if (roleFilter !== 'all') {
      console.log(`Filtering user ${user.fullname}:`, {
        role: user.role,
        filter: roleFilter,
        matches: matchesRole
      });
    }
    
    return matchesSearch && matchesRole;
  });

  // Log the users array when it's first loaded
  useEffect(() => {
    if (users.length > 0) {
      console.log('Available users and their roles:', users.map(user => ({
        name: user.fullname,
        role: user.role
      })));
    }
  }, [users]);

  // Debug logging for filtered results
  useEffect(() => {
    if (roleFilter !== 'all') {
      console.log(`Filtered users for role ${roleFilter}:`, filteredUsers.length);
    }
  }, [filteredUsers, roleFilter]);

    
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
          <h1 className="text-2xl font-bold text-[#2C3E50]">User Management</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select 
              value={roleFilter}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role">
                  {roleFilter === 'all' ? 'All Roles' : roleFilter}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Recruiter">Recruiter</SelectItem>
                <SelectItem value="Employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                // Add debug logging for each user being rendered
                console.log(`Rendering user: ${user.fullname}, Role: ${user.role}, Filter: ${roleFilter}`);
                return (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.fullname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(user)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              {userToDelete && ` "${userToDelete.fullname}"`} and remove their data from our servers.
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

export default AdminUsers; 