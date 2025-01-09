import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    interface LoginResponse {
        accessToken: string;
        refreshToken: string;
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await apiClient.post<LoginResponse>("/user/login", { email, password })
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            localStorage.setItem("role", "user");

            navigate("/user/dashboard")
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Login failed:", error.message);
            } else {
                alert('login failed. please check your credentials.')
            }
        }
    }
    const handleInspectorButton = () => {
        navigate('/inspector/login')
    }
    return (
        <div>
            <h1>Admin Login</h1>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder='email' onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder='password' onChange={(e) => setPassword(e.target.value)} />
                <button type='submit'>Login</button>
            </form>
            <button onClick={handleInspectorButton}>areYouAInspector</button>
        </div>
    )
}

export default LoginPage