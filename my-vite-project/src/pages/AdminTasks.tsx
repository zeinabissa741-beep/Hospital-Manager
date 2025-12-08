/*page dedicated for admin to assign tasks:
this page will have two boxes progress and Done boxes,
the admin cannot change these boxes or perform drop and add on them
the admin can create a task and fetch all tasks to be displayed in the appropriate box
to assign a tasks a drop down menu will show by user email*/

import type { GridValidRowModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { All, fetchUserById, tasks } from "../ApiServices";
import '../tasks.css';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { User } from '../ApiServices';
import { fetchUsers } from "../ApiServices";
import dayjs from "dayjs";
import Select from 'react-select';

export interface Task extends GridValidRowModel {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
    userId: number;
    createdAt: string;
    user: User;
}

export interface NewTaskInput {
    Newid: number;
    title: string;
    description: string;
    isCompleted: boolean;
    createdAt: string;
    userId: number;
}

export default function AdminTasks() {
    const [NewTask, setNewTask] = useState<NewTaskInput>({
        Newid: 0,
        title: "",
        description: "",
        isCompleted: false,
        createdAt: "",
        userId: 0,
    });
    const [Tasks, setTasks] = useState<Task[]>([]);
    const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
    const [doneTasks, setDoneTasks] = useState<Task[]>([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [dialogLoading, setDialogLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState<'view' | 'add'>('view'); //view = selectedTask / add = NewTask
    const [selectedTask, setSelectedTask] = useState<Task>(); //task already displayed
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const getUserEmail = (userid: number): string => allUsers.find(u => u.id === userid)?.email || 'User ${userid}'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await All();
                setTasks(data);
                setInProgressTasks(data.filter((task: { isCompleted: boolean; }) => !task.isCompleted));
                setDoneTasks(data.filter((task: { isCompleted: boolean; }) => task.isCompleted));
            }
            catch (err) {
                showSnackbar("failed to fetch tasks", "error");
            }
            finally {
                setDialogLoading(false);
            }
        };
        fetchData();
    }, [])

    const TaskBlock = ({ task }: { task: Task }) => {
        return (
            <div className="task-block">
                <h3 className="title">{task.title}</h3>
                <p className="Date"><i className="fa-solid fa-calendar"></i>{task.createdAt}</p>
            </div>
        );
    };

    const showSnackbar = (_message: string, _severity: 'success' | 'error') => {
        setSnackbar({ open: true, message: 'Task added successfully', severity: 'success' });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleDialogClose = () => {
        if (!dialogLoading) {
            setOpenDialog(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === "id" ? Number(value) : value;
        setNewTask(prev => ({ ...prev, [name]: parsedValue }));
    };


    const handleDisplayClick = (task: Task) => {
        setSelectedTask(task);
        setDialogMode('view');
        setOpenDialog(true);
    }

    const handleAddTaskClick = async () => {
        setOpenDialog(true);
        const newtask: NewTaskInput = {
            Newid: 0,
            title: "",
            description: "",
            isCompleted: false,
            createdAt: "",
            userId: 0,
        };
        setNewTask(newtask);
        setDialogMode('add');
        setOpenDialog(true);
    }

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedTasks = await All();
        setTasks(updatedTasks);
        setInProgressTasks(updatedTasks.filter((task: { isCompleted: boolean; }) => !task.isCompleted));
        setDoneTasks(updatedTasks.filter((task: { isCompleted: boolean; }) => task.isCompleted));

        try {
            setDialogLoading(true);
            const taskToAdd: Task = {
                id: NewTask.Newid,
                title: NewTask.title,
                description: NewTask.description,
                isCompleted: NewTask.isCompleted,
                userId: NewTask.userId,
                createdAt: NewTask.createdAt,
                user: await fetchUserById(NewTask.userId),
            }
            await tasks(taskToAdd);
            showSnackbar('Task added successfully', 'success');
            const updatedTasks = await All();
            setTasks(updatedTasks);
            setInProgressTasks(updatedTasks.filter((task: { isCompleted: any; }) => !task.isCompleted));
            setDoneTasks(updatedTasks.filter((task: { isCompleted: any; }) => task.isCompleted));
            setOpenDialog(false);
        }
        catch (error) {
            showSnackbar('Error adding Task: ', 'error');
        }
        finally {
            setOpenDialog(false);
            setDialogLoading(false);
        }

    }
    useEffect(() => {
        const getUsers = async () => {
            try {
                const allUsers = await fetchUsers();
                setAllUsers(allUsers);
            } catch {
                showSnackbar('Failed to fetch users', 'error');
            }
        }
        getUsers();
    }, []);



    return (
        <div>
            <h1>Admin Task Manager</h1>
            <div className="board-container">
                <div className="task-column">
                    <div className="InProgress">
                        <h2><i className="fa-solid fa-hourglass-start"></i>In Progress</h2>
                        <div className="task-column-blocks">
                            {inProgressTasks.map(task => (
                                <Button key={task.id} onClick={() => handleDisplayClick(task)} className="task-box" draggable="true">
                                    <span className="button-text">
                                        <TaskBlock key={task.id} task={task} />
                                    </span>
                                </Button>
                            ))}
                        </div>
                        <Button onClick={handleAddTaskClick} className="AddTask"sx={{
                                    color: '#be9ff7ff',
                                    fontWeight: 'bold',
                                    fontFamily: 'CourierNew, Courier, monospace',
                                    '&:hover': {
                                        backgroundColor: '#ffffff50',
                                    },
                                }}>
                            <i className="fa-solid fa-plus">
                            </i>Add Task
                        </Button>
                    </div>
                    <div className="Done">
                        <h2><i className="fa-solid fa-square-check"></i>Done</h2>
                        <div className="task-column-blocks">
                            {doneTasks.map(task => (
                                <Button key={task.id} onClick={() => handleDisplayClick(task)} className="task-box" draggable="true">
                                    <span className="button-text">
                                        <TaskBlock key={task.id} task={task} />
                                    </span>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth slotProps={{
                paper: {
                    className: 'EntireDialog',
                },
            }}>
                <DialogTitle className="DialogHeader"> {dialogMode === 'add' ? 'Add Task' : selectedTask?.title} </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleDialogClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: '#ffffff',
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <form onSubmit={handleAddTask}>
                    <DialogContent>
                        {dialogMode === 'view' && selectedTask && (
                            <div className="DialogViewPort">
                                <p className="p"><strong>Status:</strong> {selectedTask.isCompleted ? 'Done' : 'In Progress'}</p>
                                <p className="p"><strong>Assignee:</strong>{selectedTask && getUserEmail(selectedTask.userId)}</p>
                                <p className="p"><strong>Date:</strong> {selectedTask.createdAt}</p>
                                <p className="p"><strong>Description:</strong> {selectedTask.description}</p>
                            </div>
                        )}
                        {dialogMode === 'add' && (
                            <div>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    name="title"
                                    label="Title"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    onChange={handleInputChange}
                                    InputLabelProps={{
                                        sx: {
                                            color: '#ffc9e4',          // default label color
                                            fontWeight: 600,
                                            '&.Mui-focused': {
                                                color: '#dbc8ff',       // label when focused
                                            },
                                        },
                                    }}
                                    sx={{
                                        '& label': {
                                            color: '#dfc9ffff',           // label color
                                            fontWeight: '600',       // label font weight
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#cdd5f8ff',   // default border
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#dfc9ffff',   // border on hover
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#dbc8ff',
                                            },
                                        },
                                        fontSize: '16px',           // text size inside input
                                    }}
                                    required
                                    disabled={dialogLoading}
                                />
                                <div className="InProgressDialog" tabIndex={0}> In Progress</div>
                                <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                                    <Select
                                        options={allUsers.map(u => ({ value: u.id, label: u.email }))} //array of { value: number, label: string }
                                        onChange={async (selectedOption) => {
                                            if (!selectedOption) return;
                                            setNewTask(prev => ({ ...prev, userId: selectedOption.value }));
                                        }}
                                        styles={{
                                            control: (base, state) => ({
                                                ...base,
                                                minHeight: '48px',
                                                borderColor: state.isFocused ? '#dbc8ff' : '#dfc9ffff',
                                                boxShadow: 'none',
                                                '&:hover': { borderColor: '#dbc8ff' },
                                                backgroundColor: 'rgb(181 161 180 / 40%)',
                                            }),
                                            menu: (base) => ({
                                                ...base,
                                                backgroundColor: 'rgba(224, 232, 255, 0.95)', //lighter for readability
                                                color: '#4a2c4a', //darker text for contrast
                                                zIndex: 2000,
                                            }),
                                            option: (base, state) => ({
                                                ...base,
                                                backgroundColor: state.isFocused
                                                    ? '#ddc6ffff' //highlight on hover
                                                    : '#dfc9ffff)', //normal background
                                                color: '#685e79ff', //dark text
                                                '&:active': { backgroundColor: '#d8c5fcff' },
                                            }),
                                            placeholder: (base) => ({
                                                ...base,
                                                color: '#d8c5fcff',
                                                fontWeight: '600',
                                            }),
                                            singleValue: (base) => ({
                                                ...base,
                                                color: '#2c3a4aff', //match option text
                                            }),
                                        }}

                                        placeholder="Assignee"
                                    >
                                    </Select>
                                </div>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker
                                            label="Due date"
                                            value={NewTask.createdAt ? dayjs(NewTask.createdAt) : null}
                                            onChange={(newValue) => {
                                                setNewTask(prev => ({
                                                    ...prev,
                                                    createdAt: newValue ? dayjs(newValue).format("YYYY-MM-DD") : ""
                                                }));
                                            }}
                                            slotProps={{
                                                textField: {
                                                    InputLabelProps: {
                                                        sx: {
                                                            color: '#dbc8ff !important',           // default label color
                                                            fontWeight: 600,            // label font weight
                                                            '&.Mui-focused': {
                                                                color: '#dbc8ff !important',         // label when focused
                                                            },
                                                        },
                                                    },
                                                    sx: {
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderColor: '#dbc8ff !important', // default
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: '#dbc8ff !important', // hover
                                                            },
                                                        },
                                                        fontSize: '16px',
                                                    },

                                                },
                                            }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    name="description"
                                    label="Description"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    onChange={handleInputChange}
                                    InputLabelProps={{
                                        sx: {
                                            color: '#ffc9e4',          // default label color
                                            fontWeight: 600,
                                            '&.Mui-focused': {
                                                color: '#dbc8ff',       // label when focused
                                            },
                                        },
                                    }}
                                    sx={{
                                        '& label': {
                                            color: '#dbc8ff',           // label color
                                            fontWeight: '600',       // label font weight
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#dfc9ffff',   // default border
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#bdbbbbff',   // border on hover
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#dbc8ff', // border when typing/focused (blue by default)
                                            },
                                        },
                                        fontSize: '16px',           // text size inside input
                                    }}
                                />
                                <DialogActions>
                                    <Button onClick={handleDialogClose}
                                        disabled={dialogLoading}
                                        color="inherit" sx={{
                                            color: '#d8c5fcff',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                backgroundColor: '#ffffff50',
                                            },
                                        }}> Cancel
                                    </Button>
                                    <Button type="submit" variant="contained" disabled={dialogLoading} sx={{
                                        backgroundColor: '#b894fb', // hot pink
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#b894fb',
                                        },
                                    }}> submit
                                    </Button>
                                </DialogActions>
                            </div>)}
                    </DialogContent>
                </form>
            </Dialog>
            <Snackbar open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar}
                    sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div >
    );
}