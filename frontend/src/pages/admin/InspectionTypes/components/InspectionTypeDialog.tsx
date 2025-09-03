import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { InspectionTypeForm } from "./InspectionTypeForm"
import { InspectionTypeDialogProps } from "@/types/inspection.types"
import { ScrollArea } from "@/components/ui/scroll-area"

export const InspectionTypeDialog = ({
    open,
    setOpen,
    title,
    description,
    form,
    onSubmit,
    loading = false,
    isEdit = false
}: InspectionTypeDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <ScrollArea className="max-h-[60vh] h-full pr-4">
                        <InspectionTypeForm form={form} isEdit={isEdit} />
                        <DialogFooter className="mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {isEdit ? "Save Changes" : "Create"}
                            </Button>
                        </DialogFooter>
                    </ScrollArea>
                </form>
            </DialogContent>
        </Dialog>
    )
}
