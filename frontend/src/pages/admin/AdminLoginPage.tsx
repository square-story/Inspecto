import React, { useState } from "react"
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const navigate = useNavigate()
    interface LoginResponse {
        accessToken: string;
        refreshToken: string;
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await axiosInstance.post<LoginResponse>('/admin/login', { email, password })
            console.log(response)
            localStorage.setItem("accessToken", response.data.accessToken)
            localStorage.setItem("refreshToken", response.data.refreshToken)
            localStorage.setItem("role", "admin")
            navigate("/admin/dashboard")
        } catch (error) {
            if (error instanceof Error) {
                console.error("Login failed:", error.message);
            } else {
                alert('login failed. please check your credentials.')
            }
        }
    }
    return (
        <div>
            <h1>Welcome Admin</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="email" onChange={(e) => setemail(e.target.value)} />
                <input type="password" placeholder="password" onChange={(e) => setpassword(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default AdminLoginPage