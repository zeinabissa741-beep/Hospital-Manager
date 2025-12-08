import React from "react";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Routes , Route} from 'react-router-dom';
import "@fortawesome/fontawesome-free/js/all.js";

import UserGrid from "./pages/UserGrid";
import RoleGrid from "./pages/RoleGrid";
import UserPage from "./pages/MenuPageUser";
import MenuPage from "./pages/MenuPageAdmin";
import AdminTasks from "./pages/AdminTasks";
import UserTasks from "./pages/UserTasks";
import ProfilePage from "./pages/ProfilePage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/MenuPage" element={<MenuPage />} />
        <Route path="/UserGrid" element={<UserGrid />} />
        <Route path="/RoleGrid" element={<RoleGrid />} />
        <Route path="/UserPage" element={<UserPage/>} />
        <Route path="/AdminTasks" element={<AdminTasks/>} />
        <Route path="/UserTasks" element={<UserTasks/>} />
        <Route path="/ProfilePage" element={<ProfilePage/>} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;