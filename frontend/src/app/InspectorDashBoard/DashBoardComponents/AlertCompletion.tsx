import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogCancel,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AlertCompletionProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AlertCompletion = ({ isOpen, onClose }: AlertCompletionProps) => {
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate()

    const handleContinue = () => {
        setShowForm(true);
        toast.info('Please Fill This Form For Completion of the validation')
        navigate('/inspector/form-fill')
    };

    return (
        <>
            {/* Alert Dialog */}
            {!showForm && (
                <AlertDialog open={isOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are You Ready With Your Certificates?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Please confirm to proceed with the next steps.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={onClose}>Back</AlertDialogCancel>
                            <AlertDialogAction onClick={handleContinue}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    );
};
