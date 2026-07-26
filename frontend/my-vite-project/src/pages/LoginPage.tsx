 //this is the first page in the login flow
//if the user is an admin they will be redirected to the MenuPage
//if the user is a regular user they will see a Hello message

import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../login.css'
import { auth } from "../auth";

export default function LoginPage(){
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [responseMessage, setResponseMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    };
    
    const handlePasswordChange =  (e : React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    };

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) =>{
      e.preventDefault();
      setResponseMessage("");

      var apiUrl = import.meta.env.VITE_API_URL ?? "";  //https://localhost:7137/api
      try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });
      
      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        setResponseMessage(result.message || "Login failed");
      return;
      }

      if(result.token){
        localStorage.setItem('JWTtoken', result.token);
        auth.refresh(); //authentication for other pages
        setResponseMessage("Login successful!");

        const roleRes = await fetch(`${apiUrl}/Role/GetRoleByEmail?email=${email}`);
        if (!roleRes.ok) throw new Error("Failed to fetch role");
        const roleData: {id: number; roleName: string}[] = await roleRes.json();
        const isAdmin = roleData.some(role => role.roleName.trim().toLowerCase() === "admin");

        if (isAdmin) {
          navigate('/MenuPage', { state: { token: result.token } });
          const AuthenToken = result.token;
          localStorage.setItem('JWTtoken', AuthenToken);
          console.log("JWT Token:", result.token);
        } else {
          navigate('/UserPage', { state: { token: result.token, email: email } });
          console.log("JWT Token:", result.token);
        }
    }
    else{
        setResponseMessage("Login failed: No token returned");
      }
}
      catch(error:any){
        setResponseMessage(`Login failed: ${error.message}`);
      }
}
 

    return(
    <div className="Login-wrap">
    <div className="login-container">
        <h1>Login</h1>
        <form name="LoginForm" onSubmit={handleSubmit}>
      <div className = "Email">
        <label htmlFor="email">
          <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#3f1c7e"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/></svg></label>
        <input className="Emailinput" type="email" id="email" name="email" value = {email} onChange = {handleEmailChange} required/>
      </div>
      <div className = "Password">
        <label htmlFor="pwd"><svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#3f1c7e"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg></label>
        <input className="Passinput" type = "password" id = "pwd" name = "pwd" value = {password} onChange = {handlePasswordChange} required/>
      </div>
        <button type="submit">submit</button>
      </form>
      {loading && <p>Logging in...</p>}
       {responseMessage && (
    <p style={{ color: responseMessage.includes("successful") ? "green" : "red" }}>
      {responseMessage}
    </p>
    )}
    </div>
    </div>
    )
}
