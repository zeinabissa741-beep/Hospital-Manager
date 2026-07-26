import { NavLink, useNavigate } from "react-router-dom";
import logo from "../UserRole-Logo.png";
import * as React from 'react';
import '../menu.css'
import { GetTaskUser, type Task } from "../ApiServices";
import { useEffect, useState } from "react";
import { auth } from "../auth";
import { Avatar, Button, Dialog, DialogActions, DialogTitle, Menu, MenuItem, Stack, TextField } from "@mui/material";



export default function MenuPageUser() {
    //code from: https://codepen.io/blahhhuuei/pen/KwpQVGW?editors=0100
    const [completedTasks, setcompletedTasks] = useState<number>(0);
    const [pendingTasks, setpendingTasks] = useState<number>(0);
    const [DialogOpen, setDialogOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    useEffect(() => {
        const TaskCards = async () => {
            const userId = auth.getUserId();
            console.log(userId);
            if (userId !== null) {
                const data: Task[] = await GetTaskUser(userId);
                const pending = data.filter((task: { isCompleted: boolean; }) => !task.isCompleted).length;
                const done = data.filter((task: { isCompleted: boolean; }) => task.isCompleted).length;
                setcompletedTasks(done);
                setpendingTasks(pending);
            }
        };
        TaskCards();
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => { //Button
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => { //Menu anchor Element
        setAnchorEl(null);
    };

    const HandleLogOutClick = () => {
        setDialogOpen(true);
        auth.removeToken();
        navigate('/LoginPage');
    }

    const handleProfileClick = () => {
        setDialogOpen(true);
        navigate('/ProfilePage');
    }

    return (
        <div className="container" style={{
            minHeight: "75vh",
            margin: 0,
        }}>
            <aside className="sidebar">
                <div className="logo" style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)" }}>
                    <img src={logo} alt="Logo" style={{ width: 300, height: 200 }}
                    />
                </div>
                <nav className="menu">
                    <ul>
                        <li>
                            <NavLink to="/UserTasks" className={({ isActive }) => (isActive ? "active" : "")}>
                                <i className="fa-solid fa-pen-to-square" style={{ marginRight: "10px" }}></i>
                                <span className="MenuLabel">Tasks</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="content" style={{ width: 500 }} >
                <Stack direction="row" spacing={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button className="ProfileButton" aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined} onClick={handleClick}>
                        <Avatar src="/broken-image.jpg" sx={{ backgroundColor: '#3f1c7e' }} />
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                            paper: {
                                sx: {
                                    backgroundColor: 'rgba(255, 224, 254, 0.4)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                    color: 'white',
                                    fontFamily: 'CourierNew, Courier, monospace',
                                },
                            },

                            list: {
                                'aria-labelledby': 'basic-button',
                            },
                        }}

                    >
                        <MenuItem className="MenuItem" onClick={handleProfileClick} sx={{
                            fontFamily: 'Courier New, Courier, monospace',
                            color: '#ffffffff',
                            fontWeight: 'bold',
                        }}>
                            <i className="fa-regular fa-user"></i>Profile
                        </MenuItem>
                        <MenuItem className="MenuItem" onClick={HandleLogOutClick} sx={{
                            fontFamily: 'Courier New, Courier, monospace',
                            color: '#ffffffff',
                            fontWeight: 'bold',
                        }}>
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>Log Out
                        </MenuItem>

                    </Menu>
                </Stack>
                <header>
                    <h1>Welcome Back</h1>
                    <p>Check out your project statistics for today</p>
                </header>
                <div className="card-container">
                    <div className="card">
                        <div className="card-icon">
                            <i className="fa-solid fa-square-check"></i>
                        </div>
                        <div className="card-info">
                            <h3>{completedTasks}</h3>
                            <p>Completed Tasks</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-icon">
                            <i className="fas fa-clock"></i>
                        </div>
                        <div className="card-info">
                            <h3>{pendingTasks}</h3>
                            <p>Pending Tasks</p>
                        </div>
                    </div>
                </div>
            </main>
        </div >
    );
}
