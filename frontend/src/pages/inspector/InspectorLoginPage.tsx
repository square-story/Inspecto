import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";

const InspectorLoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await apiClient.post('/inspector/login', { email, password })
            localStorage.setItem("accessToken", response.data.accessToken)
            localStorage.setItem("refreshToken", response.data.refreshToken)
            localStorage.setItem('role', 'inspector')
            navigate('/inspector/dashboard')
        } catch (error) {
            if (error instanceof Error) {
                console.log('the error is :', error.message)
            } else {
                alert('error is getting in the inspector profile')
            }
        }
    }
    return (
        <>
            <div>Inspector SignIn Page</div>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder='email' onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder='password' onChange={(e) => setPassword(e.target.value)} />
                <button type='submit'>Submit</button>
            </form>
        </>
    )
}

export default InspectorLoginPage