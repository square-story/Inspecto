// components/DeleteConfirmContent.tsx
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DeleteConfirmContentProps {
    onValueChange: (value: string) => void;
}

export function DeleteConfirmContent({ onValueChange }: DeleteConfirmContentProps) {
    const [reason, setReason] = useState("");

    const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setReason(value);
        onValueChange(value);
    };

    return (
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="reason">Denial Reason</Label>
                <Textarea
                    id="reason"
                    placeholder="Enter the reason for denial..."
                    value={reason}
                    onChange={handleReasonChange}
                    className="min-h-[100px]"
                />
            </div>
        </div>
    );
}