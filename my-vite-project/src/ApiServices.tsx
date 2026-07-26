import type { GridRowId, GridValidRowModel } from "@mui/x-data-grid";

var apiUrl = import.meta.env.VITE_API_URL ?? "";
const adminToken = localStorage.getItem('JWTtoken');

export interface User extends GridValidRowModel {
  id: number;
  name: string;
  email: string;
  password: string;
  creationDate: string;
  userRole: Role[]
}

export interface Role extends GridValidRowModel {
  id: number;
  roleName: string;
  userRole: null;
}

export interface Task extends GridValidRowModel {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  userId: number;
  createdAt: string;
  user: {
    id: number,
    name: string,
    email: string,
    password: string,
    creationDate: string,
    userRole: Role[],
  },
}

//fetch Users
export const fetchUsers = async () => {
  try {
    const response = await fetch(`${apiUrl}/User/GetAll`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  }
  catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
}

//fetch CreateUser
export const createUser = async (postData: User) => {
  try {
    const response = await fetch(`https://localhost:7137/api/User/Create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

//fetch UpdateUser
export const UpdateUser = async (postData: User) => {
  try {
    const response = await fetch(`${apiUrl}/User/UpdateUser`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    console.log('user id is = ', postData.id, 'email is: ', postData.email);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    return data;
  } catch (error) {
    console.error("Error updating user", error);
    throw error;
  }
};

//fetch DeleteUser
export const DeleteUser = async (id: GridRowId) => {
  if (!window.confirm('Are you sure you want to delete this user?')) {
    return;
  }
  try {
    const response = await fetch(`${apiUrl}/User/DeleteUserId?Id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(id),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

//fetch GetUserId
export const fetchUserById = async (id: GridRowId) => {
  try {
    const response = await fetch(`${apiUrl}/User/GetById?Id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    if (!text) { throw new Error("Empty response from server") }
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}

//fetch UpdatePassword
export const FetchUpdatePassword = async (id: GridRowId, pass: string) => {
  try {
    const response = await fetch(`${apiUrl}/User/UpdatePassword?id=${id}&Password=${pass}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pass),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error updating user password", error);
    throw error;
  }
};


//fetch Roles
export const FetchRole = async () => {
  try {
    const response = await fetch(`${apiUrl}/Role/GetAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting roles:", error);
    throw error;
  }
};

//fetch CreateRole
export const CreateRole = async (postData: Role) => {
  try {
    const response = await fetch(`${apiUrl}/Role/Create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error creating roles");
    throw error;
  }
};

//fetch UpdateRole
export const UpdateRole = async (postData: Role) => {
  try {
    const response = await fetch(`${apiUrl}/Role/Update`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
};

//fetch DeleteRole
export const DeleteRole = async (id: GridRowId) => {
  if (!window.confirm('Are you sure you want to delete this role?')) {
    return;
  }
  try {
    const response = await fetch(`${apiUrl}/Role/Delete?Id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(id),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
};

//fetch GetRole by id
export const fetchRoleById = async (id: GridRowId) => {
  try {
    const response = await fetch(`${apiUrl}/Role/GetRoleId?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    if (!text) { throw new Error("Empty response from server") }
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Error getting role:", error);
    throw error;
  }
}


//fetch roles for User by userid
export const fetchRolesForUser = async (id: GridRowId) => {
  try {
    const response = await fetch(`${apiUrl}/UserRole/GetRolesForUser?userId=${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    if (!text) { throw new Error("Empty response from server") }
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Error getting roles:", error);
    throw error;
  }
}

//fetch EmployUser
export const EmployUser = async (id: GridRowId, id2: GridRowId) => {
  try {
    const response = await fetch(`${apiUrl}/UserRole/EmployUser?userId=${id}&roleId=${id2}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    if (!text) { throw new Error("Empty response from server") }
    //const data = JSON.parse(text);
    return text;
  } catch (error) {
    console.error("Error adding roles:", error);
    throw error;
  }
}

//fetch DeleteRoleForUser
export const DeleteRoleForUser = async (id: GridRowId, id2: GridRowId) => {
  try {
    const response = await fetch(`${apiUrl}/UserRole/DeleteRoleForUser?userId=${id}&roleId=${id2}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    if (!text) { throw new Error("Empty response from server") }
    //const data = JSON.parse(text);
    return text;
  } catch (error) {
    console.error("Error adding roles:", error);
    throw error;
  }
}

//fetch tasks to create task
export const tasks = async (task: Task) => {
  try {
    const response = await fetch(`https://localhost:7137/api/Task/tasks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

//fetch GetTaskUser 
export const GetTaskUser = async (id: GridRowId) => {
  try {
    const response = await fetch(`${apiUrl}/Task/GetTaskUser?userId=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    if (!text) { throw new Error("Empty response from server") }
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Error getting tasks for user:", error);
    throw error;
  }
}

//fetch Complete to mark task as complete
export const Complete = async (id: GridRowId) => {
  try {
    const response = await fetch(`${apiUrl}/Task/Complete?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    if (!text) { throw new Error("Empty response from server") }
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Error getting tasks for user:", error);
    throw error;
  }
}

//fetch All to get all tasks
export const All = async () => {
  try {
    const response = await fetch(`${apiUrl}/Task/All`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  }
  catch (error) {
    console.error("Error getting tasks:", error);
    throw error;
  }
}