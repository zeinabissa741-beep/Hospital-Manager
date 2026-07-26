import { NavLink } from "react-router-dom";
import logo from "../UserRole-Logo.png";
import '../menu.css'
import { All, fetchUsers,type Task, type User } from "../ApiServices";
import { useEffect, useState } from "react";



export default function MenuPageAdmin() {
    //code from: https://codepen.io/blahhhuuei/pen/KwpQVGW?editors=0100
    //function to fetch number of all users in the user database
    //function to fetch number of all uncompleted tasks in the tasks database
    const [AvailableUser, setAvailableUser] = useState<number>(0);
    const [pendingTasks, setpendingTasks] = useState<number>(0);

    useEffect(() => {
        const Cards = async () => {
            const data1: User[] = await fetchUsers();
            const data : Task[] = await All();

            const users = data1.length;
            const pending = data.filter((task: { isCompleted: boolean; }) => !task.isCompleted).length;

            setAvailableUser(users);
            setpendingTasks(pending);
        };
        Cards();
    })

    return (
        <div className="container" style={{
            minHeight: "75vh",
            margin: 0,
        }}>
            <aside className="sidebar">
                <div className="logo" style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)" }}>
                    <img src={logo} alt="Logo" style={{ width: 300, height: 200 }} />
                </div>
                <nav className="menu">
                    <ul>
                        <li>
                            <NavLink to="/UserGrid" className={({ isActive }) => (isActive ? "active" : "")}>
                                <i className="fa-solid fa-users"></i>
                                <span className="MenuLabel">User Grid</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/RoleGrid" className={({ isActive }) => (isActive ? "active" : "")}>
                                <i className="fa-solid fa-toolbox"></i>
                                <span className="MenuLabel">Role Grid</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/AdminTasks" className={({ isActive }) => (isActive ? "active" : "")}>
                                <i className="fa-solid fa-pen-to-square"></i>
                                <span className="MenuLabel">Tasks</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="content" style={{ width: 500 }}>
                <header>
                    <h1>Welcome Back Admin</h1>
                    <p>Check out your project statistics for today</p>
                </header>
                <div className="card-container">
                    <div className="card">
                        <div className="card-icon">
                            <i className="fa-solid fa-user"></i>
                        </div>
                        <div className="card-info">
                            <h3>{AvailableUser}</h3> {/* change to get All users in the database*/}
                            <p>Available users</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-icon">
                            <i className="fas fa-clock"></i>
                        </div>
                        <div className="card-info">
                            <h3>{pendingTasks}</h3> {/* change to get All and generate tasks that have IsCompleted = false*/}
                            <p>Pending Total Tasks</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
