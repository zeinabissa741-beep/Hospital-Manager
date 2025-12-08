//this page will contain a table of roles with options to add, edit, and delete roles
//it is only accessible to admin users
//a pop-up form will be used to add and edit roles
//a delete button will be available for each role in the table with confirmation prompt

import { useEffect, useState } from 'react';
import {type Role } from '../ApiServices';
import DataTable from '../component/DataTable';
import {fetchRoleById} from '../ApiServices'
import {FetchRole} from '../ApiServices'
import { CreateRole } from '../ApiServices';
import { UpdateRole } from '../ApiServices';
import { DeleteRole } from '../ApiServices';
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

export interface NewRole extends GridValidRowModel {
  id: number;
  roleName: string;
  userRole: null
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'roleName', headerName: 'RoleName', width: 150, editable: true },
  ];

const roleTableStyles = {height:'700px'};


export default function RoleGrid(){
  const [roles, setRoles] = useState<NewRole[]>([]);
  const[loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>();
  const [newRole, setNewRole] = useState<Role>({ id: 0,
  roleName: '',
  userRole: null,});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  

 useEffect(() => {
  FetchRole().then(data => setRoles(data));
}, []);


  const showSnackbar = (message:string, severity: 'success' | 'error') => {
    setSnackbar({open: true, message, severity});
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddClick = () => {
    setEditingRole(null);
    setNewRole({id: 0,roleName:'', userRole: null});
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    if (!dialogLoading) {
      setOpenDialog(false);
      setEditingRole(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: any = value;
    
    if (name === "id") {
      parsedValue = Number(value);
    }
    else if (editingRole) {
      setEditingRole({ ...editingRole, [name]: parsedValue });
    } 
    else {
    setNewRole({ ...newRole, [name]: parsedValue });
    }
  };


  const handleAddUser = async() => {
    try{
      setDialogLoading(true);
      await CreateRole(newRole);
      showSnackbar('Role added successfully', 'success');
      FetchRole();
      setOpenDialog(false);
    }
    catch (error){
       showSnackbar('Error adding Role: ', 'error');
    }
    finally{
      setDialogLoading(false);
    }

  }

  const handleEditClick = (id:GridRowId) => async() => {
      const user = await fetchRoleById(id);
      if (user){
        setEditingRole({...user});
        setOpenDialog(true);
      }
      
  }
  
  const handleDeleteClick = (id: GridRowId) => async() => {
    try{
      setLoading(true);
      await DeleteRole(id);
      showSnackbar('Role deleted successfully', 'success');
      FetchRole();
    }
    catch (error) {
      showSnackbar('Error deleting user: ', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (editingRole) {
    await handleSaveUser();
  } else {
    await handleAddUser();
  }
};

  const handleSaveUser = async() => {
    if(!editingRole || !editingRole.id) return
    try{
      setDialogLoading(true);
      await UpdateRole(editingRole);
      showSnackbar('Role updated successfully', 'success');
      FetchRole();
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
      <div className = "RoleGrid">
        <DataTable 
        row={roles}
        columns={columns}
        loading={loading}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        addButtonLabel="Add Role"
        showAddButton={true}
        sx={roleTableStyles}
        />

        <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth >
          <DialogTitle> {editingRole ? 'Edit Role' : 'Add New Role'} </DialogTitle>
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <TextField
              autoFocus
              margin="dense"
              name="RoleName"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              value={editingRole ? editingRole.name : newRole.name}
              onChange={handleInputChange}
              sx={{ mt: 1 }}
              required
              disabled = {dialogLoading}
            />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose}
                disabled={dialogLoading}
                color="inherit"> Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={dialogLoading}>
                  {dialogLoading ? 'Processing...' : (editingRole? 'Update' : 'Add')}
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
      </div>
      );
}
