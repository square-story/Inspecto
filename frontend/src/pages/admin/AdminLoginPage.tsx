import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/auth/authAPI';
import { RootState, AppDispatch } from '../../features/app/store';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { isLoading } = useSelector((state: RootState) => state.auth);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const result = await dispatch(
                loginUser({
                    email,
                    password,
                    role: 'admin'
                })
            ).unwrap();

            if (result) {
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div>
            <h1>Welcome Admin</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default AdminLoginPage;