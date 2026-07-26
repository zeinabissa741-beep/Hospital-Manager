//this page will have a click to go to the dashboard for now (expandile menu)
//it will contain user fields password, email, username
//<i class="fa-solid fa-user"></i> username
//<i class="fa-solid fa-lock"></i> different clicl Password 
//<i class="fa-solid fa-envelope"></i> Email
import { FetchUpdatePassword, UpdateUser } from '../ApiServices';
import { useEffect, useState } from 'react';
import { fetchUserById, type User } from '../ApiServices'
import { auth } from '../auth';
import type { GridRowId } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogTitle, TextField } from '@mui/material';
import '../ProfilePage.css'

export default function ProfilePage() {
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(false);
    const [NewPassword, setNewPassword] = useState<string>();
    const [editingUser, setEditingUser] = useState<User | null>();
    const [isEditable, setIsEditable] = useState(false);
    const [DialogOpen, setDialogOpen] = useState<boolean>(false);
    const [DialogLoading, setDialogLoading] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const CurrentUser = async () => {
            try {
                setLoading(true);
                const userId = auth.getUserId();
                if (userId != null) {
                    const data = await fetchUserById(userId);
                    setUser(data);
                }
            } catch (err) {
                showSnackbar("Failed to fetch users", "error");

            } finally {
                setLoading(false);
            }
        };
        CurrentUser();
    }, []);

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (editingUser) {
            setEditingUser({ ...editingUser, [name]: value });
        }
        else {
            setNewPassword(value);
        }
    }

    const handleEditClick = (id: GridRowId) => async () => {
        setIsEditable(true);
        const user = await fetchUserById(id);
        if (user) {
            setEditingUser({ ...user });
        }
    }

    const handleDialogClose = () => {
        if (!DialogLoading) {
            setDialogOpen(false);
        }
    };

    const handleUpdatePasswordClick = () => {
        setDialogOpen(true);
    };

    const UpdatePassword = async () => {

        try {
            setDialogLoading(true);
            const userId = auth.getUserId();
            if (userId != null && NewPassword != null) {
                await FetchUpdatePassword(userId, NewPassword);
                console.log("Task Added successfuly");
            }
            setDialogOpen(false);
        }
        catch (err) {
            console.error("Password failed to update", err);
        }
        finally {
            setDialogOpen(false);
            setDialogLoading(false);

        }
    }


    const handleSaveUser = async () => {
        if (!editingUser || !editingUser.id) return
        try {
            setLoading(true);
            await UpdateUser(editingUser);
            showSnackbar('Info Updated Successfully', 'success');
            const userId = auth.getUserId();
            if (userId != null) {
                fetchUserById(userId);
            }
        } catch (error) {
            showSnackbar('Error Updating Info', 'error');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        document.body.classList.add("profile-body");
        return () => {
            document.body.classList.remove("profile-body");
        };
    }, []);

    return (
        <div className="MainContainer">
            <div className="EditingButtons">
                <Button className="EditClick" onClick={() => {
                    setIsEditable(true);
                    if (user?.id != null) {
                        handleEditClick(user.id)();
                    }
                }}
                    sx={{
                        color: '#8746ffff',
                        fontWeight: 'bold',
                        backgroundColor: '#ffffff51',
                        fontFamily: 'CourierNew, Courier, monospace',
                        '&:hover': {
                            backgroundColor: '#ffffff7d',
                        },
                    }}
                >
                    <i className="fa-solid fa-user-pen"></i>update info
                </Button>
                <Button className="EditPassClick" onClick={handleUpdatePasswordClick}
                    sx={{
                        color: '#8746ffff',
                        fontWeight: 'bold',
                        backgroundColor: '#ffffff51',
                        fontFamily: 'CourierNew, Courier, monospace',

                        '&:hover': {
                            backgroundColor: '#ffffff7d',
                        },
                    }}>
                    <i className="fa-solid fa-lock"></i>update password
                </Button>
            </div>
            <div className="UserInfo">
                <div className="UserRow">
                    <div className="UserNameProfile">
                        <label className="UserLabel"><i className="fa-solid fa-user"></i>UserName</label>
                        <input name="name"
                            value={editingUser?.name ?? user?.name ?? ""}
                            disabled={!isEditable}
                            onChange={handleInputChange} />
                    </div>
                    <div className="EmailProfile">
                        <label className="UserLabel"><i className="fa-solid fa-envelope"></i>Email</label>
                        <input name="email"
                            value={editingUser?.email ?? user?.email ?? ""}
                            disabled={!isEditable}
                            onChange={handleInputChange} />
                    </div>
                </div>
                {isEditable && (
                    <div className="EditActions">
                        <Button onClick={async () => {
                            await handleSaveUser();
                            const userId = auth.getUserId();
                            if (userId != null) {
                                const freshUser = await fetchUserById(userId);
                                setUser(freshUser);
                            }
                            setIsEditable(false);
                        }}
                            sx={{
                                color: '#8746ffff',
                                fontWeight: 'bold',
                                backgroundColor: '#ffffff51',
                                fontFamily: 'CourierNew, Courier, monospace',
                                '&:hover': {
                                    backgroundColor: '#ffffff7d',
                                },
                            }} className="EditButton-Checkmark">
                            <i className="fa-solid fa-check"></i>
                        </Button>
                        <Button onClick={() => {
                            setEditingUser(user ?? null);
                            setIsEditable(false);
                        }}
                            sx={{
                                color: '#8746ffff',
                                fontWeight: 'bold',
                                backgroundColor: '#ffffff51',
                                fontFamily: 'CourierNew, Courier, monospace',
                                '&:hover': {
                                    backgroundColor: '#ffffff7d',
                                },
                            }} className="EditButton-XMark">
                            <i className="fa-solid fa-xmark"></i>
                        </Button>
                    </div>
                )}
            </div>
            <Dialog open={DialogOpen} onClose={handleDialogClose} PaperProps={{
                sx: {
                    backgroundColor: 'rgba(255, 224, 254, 0.4)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                },
            }}
            >
                <DialogTitle sx={{
                    fontFamily: 'Courier New, Courier, monospace',
                    color: '#d8c5fcff',
                    fontWeight: 'bold',
                }}>Update Password</DialogTitle>
                <form onSubmit={UpdatePassword}>
                    <TextField
                        margin="dense"
                        name="Password"
                        label="Password"
                        type="text"
                        fullWidth
                        variant="outlined"
                        onChange={handleInputChange}
                        InputLabelProps={{
                            sx: {
                                color: '#dbcdf7ff',          // default label color
                                fontWeight: 600,
                                '&.Mui-focused': {
                                    color: '#b894fb',       // label when focused
                                },
                            },
                        }}
                        sx={{
                            '& label': {
                                color: '#dbcdf7ff',           // label color
                                fontWeight: '600',       // label font weight
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#ccc',   // default border
                                },
                                '&:hover fieldset': {
                                    borderColor: '#bdbbbbff',   // border on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#b894fb', // border when typing/focused (blue by default)
                                },
                            },
                            fontSize: '16px',           // text size inside input
                        }}>

                    </TextField>
                    <DialogActions>
                        <Button onClick={handleDialogClose}
                            disabled={DialogLoading}
                            color="inherit" sx={{
                                color: '#d8c5fcff',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: '#ffffff50',
                                },
                            }}> Cancel
                        </Button>
                        <Button type="submit" variant="contained" disabled={DialogLoading} sx={{
                            backgroundColor: '#b894fb',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#b894fb',
                            },
                        }}> submit
                        </Button>
                    </DialogActions>
                </form>

            </Dialog>

        </div>
    );
}
