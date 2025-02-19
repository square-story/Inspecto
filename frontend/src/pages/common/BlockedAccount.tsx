import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/features/auth/authAPI';
import { AppDispatch } from '@/store';

export default function BlockedAccount() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleLogout = async () => {
        dispatch(logoutUser());
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Account Blocked</h1>
                <p className="mb-4">Your account has been blocked. Please contact support.</p>
                <Button onClick={handleLogout}>Logout</Button>
            </div>
        </div>
    );
}