import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner";

interface AddDocumentProps {
    isDialogOpen: boolean;
    setIsDialogOpen: (isOpen: boolean) => void,
    title?: string,
    isEdit?: boolean,
    SubmitButtonTitle?: string
}

export const HandleDocumentOperation = ({ isDialogOpen, setIsDialogOpen, SubmitButtonTitle = "Add Document", isEdit = false, title = "Add New Document" }: AddDocumentProps) => {
    const handleAddDocument = () => {
        toast.info(isEdit ? 'edit document' : "add document")
        toast.success('clicked')
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddDocument}>
                        {SubmitButtonTitle}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
