

import type { GridValidRowModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Complete, GetTaskUser } from "../ApiServices";
import '../tasks.css';
import { Alert, Button, Checkbox, Dialog, DialogContent, DialogTitle, IconButton, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import type { User } from '../ApiServices';
import { auth } from '../auth';

export interface Task extends GridValidRowModel {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
    userId: number;
    createdAt: string;
    user: User;
}

export default function AdminTasks() {
    const [Tasks, setTasks] = useState<Task[]>([]);
    const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
    const [doneTasks, setDoneTasks] = useState<Task[]>([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [dialogLoading, setDialogLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    //const [dialogMode, setDialogMode] = useState<'view' | 'add'>('view'); //view = selectedTask / add = NewTask
    const [selectedTask, setSelectedTask] = useState<Task>(); //task already displayed
    //const [allUsers, setAllUsers] = useState<User[]>([]);
    //const [, setSelectedUser] = useState<User>();
    const getUserEmail = auth.getUserEmail();
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = auth.getUserId();
                console.log(userId);
                if (userId !== null) {
                    const data = await GetTaskUser(userId);
                    setTasks(data);
                    setInProgressTasks(data.filter((task: { isCompleted: boolean; }) => !task.isCompleted));
                    setDoneTasks(data.filter((task: { isCompleted: boolean; }) => task.isCompleted));
                }
            }
            catch (err) {
                showSnackbar("failed to fetch tasks", "error");
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

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
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

    const handleCheckboxClick = async (id: number) => {
        try {
            window.alert("Press ok to confirm task completion");
            console.log(id);
            setTasks(prevTasks => {
                const updated = prevTasks.map(task =>
                    task.id === id ? { ...task, isCompleted: true } : task
                );
                setInProgressTasks(updated.filter(task => !task.isCompleted));
                setDoneTasks(updated.filter(task => task.isCompleted));
                return updated;
            })
            await Complete(id);
            const userId = auth.getUserId();
            if (userId != null) {
                const updatedTasks = await GetTaskUser(userId);
                setTasks(updatedTasks);
                setInProgressTasks(updatedTasks.filter((task: { isCompleted: boolean; }) => !task.isCompleted));
                setDoneTasks(updatedTasks.filter((task: { isCompleted: boolean; }) => task.isCompleted));
            }
        }
        catch (err) {
            console.error("error checking task", err);
        }
    };


    const handleDisplayClick = (task: Task) => {
        setSelectedTask(task);
        setOpenDialog(true);
    }

    return (
        <div>
            <h1>Task Manager</h1>
            <div className="board-container">
                <div className="task-column">
                    <div className="InProgress">
                        <h2><i className="fa-solid fa-hourglass-start"></i>In Progress</h2>
                        <div className="task-column-blocks">
                            {inProgressTasks.map(task => (
                                <div
                                    key={task.id}
                                    style={{
                                        position: 'relative',
                                        overflow: 'visible',
                                        display: 'inline-block',
                                    }}
                                >
                                    <Button
                                        onClick={() => handleDisplayClick(task)}
                                        className="task-box"
                                        draggable="true"
                                        style={{
                                            position: 'relative',
                                            paddingLeft: '2.5rem !important',
                                            overflow: 'hidden !important', // let it be — we’re outside now
                                        }}>
                                        <Checkbox
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleCheckboxClick(task.id);
                                            }}
                                            className="task-checkbox"
                                            sx={{
                                                width: '1rem !important',
                                                height: '1rem !important',
                                                borderRadius: '0.25rem !important',
                                                color: '#=#7d63af !important',
                                                '&.Mui-checked': {
                                                    color: '#985c97 !important',
                                                    backgroundColor: '#e8d1ffff !important',
                                                },
                                            }}
                                        />
                                        <span className="checkmark"></span>
                                        <span className="button-text">
                                            <TaskBlock task={task} />
                                        </span>
                                    </Button>
                                </div>

                            ))}
                        </div>
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
                <DialogTitle className="DialogHeader"> {selectedTask?.title} </DialogTitle>
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
                <DialogContent>
                    {selectedTask && (
                        <div className="DialogViewPort">
                            <p className="p"><strong>Status:</strong> {selectedTask.isCompleted ? 'Done' : 'In Progress'}</p>
                            <p className="p"><strong>Assignee:</strong>{selectedTask && getUserEmail}</p>
                            <p className="p"><strong>Date:</strong> {selectedTask.createdAt}</p>
                            <p className="p"><strong>Description:</strong> {selectedTask.description}</p>
                        </div>
                    )}
                </DialogContent>
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