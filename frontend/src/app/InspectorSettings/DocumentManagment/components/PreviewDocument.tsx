import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PreviewDocumentProps {
    previewDocument: {
        name?: string,
        imageUrl: string,
    };
    isPreviewOpen: boolean,
    setIsPreviewOpen: (isOpen: boolean) => void
}


export const PreviewDocument = ({ previewDocument, isPreviewOpen, setIsPreviewOpen }: PreviewDocumentProps) => {
    return (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{previewDocument?.name || "Document Preview"}</DialogTitle>
                </DialogHeader>
                <div className="mt-2 relative">
                    <ScrollArea className="h-full max-h-[calc(90vh-8rem)] px-5 scroll-smooth"><img
                        src={previewDocument?.imageUrl || "/api/placeholder/800/600"}
                        alt={previewDocument?.name || "Document Preview"}
                        className="max-w-full h-auto"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/api/placeholder/800/600";
                        }}
                    />
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    )
}
