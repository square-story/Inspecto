import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Edit, Trash, Plus, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { PreviewDocument } from "./PreviewDocument";
import { HandleDocumentOperation } from "./HandleDocumentOperation";
import { useConfirm } from "@omit/react-confirm-dialog";

interface Document {
    id: string;
    imageUrl: string;
    name?: string;
}

interface DocumentListProps {
    initialDocuments: string[]; // These are image URLs
}

export const DocumentList = ({ initialDocuments }: DocumentListProps) => {

    const confirm = useConfirm()
    // Convert string array (image URLs) to Document objects
    const initialDocs = initialDocuments.map((imageUrl, index) => ({
        id: `doc-${index}`,
        imageUrl,
        name: `Document ${index + 1}`
    }));

    const [documents, setDocuments] = useState<Document[]>(initialDocs);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Filter documents based on search query (on name if available)
    const filteredDocuments = documents.filter(doc =>
        (doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    );

    const handleDeleteDocument = async (documentId: string) => {
        const response = await confirm({
            title: 'Delete Item',
            description: 'Are you sure? This action cannot be undone.',
            icon: <Trash className="size-4 text-destructive" />,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            cancelButton: {
                size: 'default',
                variant: 'outline'
            },
            confirmButton: {
                className: 'bg-red-500 hover:bg-red-600 text-white'
            },
            alertDialogTitle: {
                className: 'flex items-center gap-2'
            }
        })
        if (response) setDocuments(docs => docs.filter(doc => doc.id !== documentId));
    };


    const handleEditDocument = () => {
        setIsEditDialogOpen(true);
    };




    const handlePreviewDocument = (document: Document) => {
        setPreviewDocument(document);
        setIsPreviewOpen(true);
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Documents</CardTitle>
                <Button
                    size="sm"
                    onClick={() => {
                        setIsAddDialogOpen(true);
                    }}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Document
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="flex w-full items-center space-x-2 p-4 pb-0">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search documents..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <ScrollArea className="h-[calc(90vh-10rem)] py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
                        {filteredDocuments.length > 0 ? (
                            filteredDocuments.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex flex-col bg-muted/50 rounded-md overflow-hidden"
                                >
                                    <div className="relative h-40 w-full bg-gray-100">
                                        <img
                                            src={doc.imageUrl || "/api/placeholder/200/150"}
                                            alt={doc.name || "Document"}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = "/api/placeholder/200/150";
                                            }}
                                        />
                                    </div>
                                    <div className="p-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium truncate">{doc.name || "Unnamed Document"}</span>
                                            <div className="flex space-x-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handlePreviewDocument(doc)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditDocument()}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteDocument(doc.id)}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-6 text-muted-foreground">
                                {searchQuery ? "No documents found" : "No documents yet"}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>


            {/* Edit Document Dialog */}
            <HandleDocumentOperation isDialogOpen={isEditDialogOpen} setIsDialogOpen={setIsEditDialogOpen} SubmitButtonTitle="Update" isEdit={true} title="Edit Document" />

            {/* Add Document Dialog */}
            <HandleDocumentOperation isDialogOpen={isAddDialogOpen} setIsDialogOpen={setIsAddDialogOpen} />

            {/* Document Preview Dialog */}
            {previewDocument && (
                <PreviewDocument isPreviewOpen={isPreviewOpen} setIsPreviewOpen={setIsPreviewOpen} previewDocument={previewDocument} />
            )}
        </Card>
    );
};