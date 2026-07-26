//this page will contain a table of users with options to add, edit, and delete roles
//it is only accessible to admin users
//a pop-up form will be used to add and edit users
//a delete button will be available for each user in the table with confirmation prompt
//code from https://github.com/theatypicaldeveloper/materialUi-in-react/blob/lesson-10-data-grid/src/components/UserTable/UserTable.js
//mui


import { useEffect, useState } from 'react';
import {fetchRolesForUser, type User } from '../ApiServices';
import DataTable from '../component/DataTable';
import {fetchUserById, fetchUsers} from '../ApiServices'
import { createUser } from '../ApiServices';
import { UpdateUser } from '../ApiServices';
import { DeleteUser } from '../ApiServices';
import '../grid.css';

import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  DialogContent,
} from '@mui/material';
import type { GridValidRowModel, GridColDef, GridRowId } from '@mui/x-data-grid';
import { UserRolesDialog } from '../component/UserRolesDialog';

export interface NewUser extends GridValidRowModel {
  id: number;
  name: string;
  email: string;
  password: '';
  creationDate: string;
  userRole: null
}


const userTableStyles = {height:'700px'};


export default function UserGrid(){
  const [users, setUsers] = useState<NewUser[]>([]);
  const[loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>();
  const [newUser, setNewUser] = useState<User>({ id: 0,
  name: '',
  email: '',
  password: '',
  creationDate: '',
  userRole: [],});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [roleCounts, setRoleCounts] = useState<Record<number, number>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    { field: 'email', headerName: 'Email', width: 200, editable: true },
    {
      field: 'creationDate',
      headerName: 'Created At',
      width:150,
      editable: true
    },
    {
      field: "roles",
      headerName: "Roles",
      width: 180,
      renderCell: (params) => (
         <Button
        onClick={() => {
          setSelectedUserId(params.row.id.toString());
          setDialogLoading(true);
        }}
      >
        View Roles ({roleCounts[params.row.id] ?? "..."})
      </Button>
    ),
}, ];

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      showSnackbar("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

 useEffect(() => {
  if (users.length === 0) return;

  const fetchRoleCounts = async () => {
    const counts: Record<number, number> = {};
    for (const user of users) {
      try {
        const roles = await fetchRolesForUser(user.id);
        counts[user.id] = roles.length;
      } catch {
        counts[user.id] = 0;
      }
    }
    setRoleCounts(counts);
  };

  fetchRoleCounts();
}, [users]);


  const showSnackbar = (message:string, severity: 'success' | 'error') => {
    setSnackbar({open: true, message, severity});
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddClick = () => {
    setEditingUser(null);
    setNewUser({id: 0,name:'', email:'', password: '',creationDate:'', userRole: []});
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    if (!dialogLoading) {
      setOpenDialog(false);
      setEditingUser(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: any = value;
    
    if (name === "id") {
      parsedValue = Number(value);
    }
    else if (editingUser) {
      setEditingUser({ ...editingUser, [name]: parsedValue });
    } 
    else {
    setNewUser({ ...newUser, [name]: parsedValue });
    }
  };


  const handleAddUser = async() => {
    try{
      setDialogLoading(true);
      await createUser(newUser);
      showSnackbar('User added successfully', 'success');
      fetchUsers();
      setOpenDialog(false);
    }
    catch (error){
       showSnackbar('Error adding user: ', 'error');
    }
    finally{
      setDialogLoading(false);
    }

  }

  const handleEditClick = (id:GridRowId) => async() => {
      const user = await fetchUserById(id);
      if (user){
        setEditingUser({...user});
        setOpenDialog(true);
      }
      
  }
  
  const handleDeleteClick = (id: GridRowId) => async() => {
    try{
      setLoading(true);
      await DeleteUser(id);
      showSnackbar('User deleted successfully', 'success');
      fetchUsers();
    }
    catch (error) {
      showSnackbar('Error deleting user: ', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (editingUser) {
    await handleSaveUser();
  } else {
    await handleAddUser();
  }
};

  const handleSaveUser = async() => {
    if(!editingUser || !editingUser.id) return
    try{
      setDialogLoading(true);
      //const user = await fetchUserById(editingUser.id);
      await UpdateUser(editingUser);
      showSnackbar('User updated successfully', 'success');
      fetchUsers();
      setOpenDialog(false);
    }
    catch(error){
      showSnackbar('Error adding user: ', 'error');
    }
    finally{
      setDialogLoading(false);
    }
  }


     return (
      <div className = "UserGrid">
        <DataTable 
        row={users}
        columns={columns}
        loading={loading}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        addButtonLabel="Add User"
        showAddButton={true}
        sx={userTableStyles}
        />
        <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth >
          <DialogTitle> {editingUser ? 'Edit User' : 'Add New User'} </DialogTitle>
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              value={editingUser ? editingUser.name : newUser.name}
              onChange={handleInputChange}
              sx={{ mt: 1 }}
              required
              //disabled = {dialogLoading}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={editingUser ? editingUser.email : newUser.email}
              onChange={handleInputChange}
              sx={{ mt: 2 }}
              required
              disabled={dialogLoading}
            />
            <TextField
              margin="dense"
              name="creationDate"
              label="Creation Date"
              type="date"
              fullWidth
              variant="outlined"
              value={editingUser ? editingUser.creationDate.toString().split("T")[0] : newUser.creationDate.toString().split("T")[0]}
              onChange={handleInputChange}
              sx={{ mt: 2 }}
              disabled={dialogLoading}
            />
            {!editingUser && (
              <TextField
              margin="dense"
              name="passwordHash"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={newUser.passwordHash}
              onChange={handleInputChange}
              required
              disabled={dialogLoading}
              />
            )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose}
                disabled={dialogLoading}
                color="inherit"> Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={dialogLoading}>
                  {dialogLoading ? 'Processing...' : (editingUser? 'Update' : 'Add')}
                </Button>
              </DialogActions>
            </form>
        </Dialog>

        <Snackbar open = {snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}>
          <Alert onClose = {handleCloseSnackbar}
          sx={{width : '100%'}}>
            {snackbar.message}
          </Alert>
        </Snackbar>
        {selectedUserId !== null && (
          <Dialog open={true} onClose={() => setSelectedUserId(null)} maxWidth="sm" fullWidth>
          <DialogTitle>User Roles</DialogTitle>
          <DialogContent>
          <UserRolesDialog
          userId={Number(selectedUserId)}
          onClose={() => setSelectedUserId(null)}
          /></DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedUserId(null)}>Close</Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
      );
}
