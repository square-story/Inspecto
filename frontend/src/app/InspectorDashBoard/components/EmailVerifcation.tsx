import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface AlertCompletionProps {
    onClose: () => void;
}

export function EmailVerificationAlert({ onClose }: AlertCompletionProps) {
    return (
        <Alert variant="default" className="fixed inset-0 flex items-center justify-center bg-secondary  z-50">
            <AlertCircle className="h-20 w-20" />
            <div className="grid gap-10">
                <AlertTitle className="text-5xl">Verification Pending</AlertTitle>
                <AlertDescription className="text-3xl">Wait until the email sent to your account when the verification is completed.</AlertDescription>
                <Button className="h-12 rounded-full" onClick={onClose}>Logout</Button>
            </div>
        </Alert>
    )
}