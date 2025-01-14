import { Toaster, toast } from 'sonner'

interface ToasterTriggerProps {
    type?: 'info' | 'success' | 'error' | 'warning'; // Limit to valid types
    message: string;
}

export function ToasterTrigger({ type = 'info', message }: ToasterTriggerProps) {
    const handleToast = () => {
        switch (type) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
                toast.error(message);
                break;
            case 'warning':
                toast.warning(message);
                break;
            default:
                toast(message); // Default is an "info"-style toast
        }
    };

    return (
        <div>
            <Toaster />
            <button onClick={handleToast}>
                Give me a toast
            </button>
        </div>
    );
}
