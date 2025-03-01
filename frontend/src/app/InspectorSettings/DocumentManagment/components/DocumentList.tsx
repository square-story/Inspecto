import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Search, Edit, Trash, Plus, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Document {
    id: string;
    imageUrl: string;
    name?: string;
}

interface DocumentListProps {
    initialDocuments: string[]; // These are image URLs
}

export const DocumentList = ({ initialDocuments }: DocumentListProps) => {
    // Convert string array (image URLs) to Document objects
    const initialDocs = initialDocuments.map((imageUrl, index) => ({
        id: `doc-${index}`,
        imageUrl,
        name: `Document ${index + 1}`
    }));

    const [documents, setDocuments] = useState<Document[]>(initialDocs);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingDocument, setEditingDocument] = useState<Document | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newDocumentName, setNewDocumentName] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');

    // Filter documents based on search query (on name if available)
    const filteredDocuments = documents.filter(doc =>
        (doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    );

    const handleEditDocument = (document: Document) => {
        setEditingDocument(document);
        setNewDocumentName(document.name || '');
        setNewImageUrl(document.imageUrl);
        setIsEditDialogOpen(true);
    };

    const handleSaveEdit = () => {
        if (editingDocument) {
            setDocuments(docs =>
                docs.map(doc =>
                    doc.id === editingDocument.id
                        ? {
                            ...doc,
                            name: newDocumentName.trim() ? newDocumentName : doc.name,
                            imageUrl: newImageUrl.trim() ? newImageUrl : doc.imageUrl
                        }
                        : doc
                )
            );
            setIsEditDialogOpen(false);
            setEditingDocument(null);
            setNewDocumentName('');
            setNewImageUrl('');
        }
    };

    const handleDeleteDocument = (documentId: string) => {
        setDocuments(docs => docs.filter(doc => doc.id !== documentId));
    };

    const handleAddDocument = () => {
        if (newImageUrl.trim()) {
            const newDoc: Document = {
                id: `doc-${Date.now()}`,
                imageUrl: newImageUrl,
                name: newDocumentName.trim() ? newDocumentName : `Document ${documents.length + 1}`
            };
            setDocuments([...documents, newDoc]);
            setIsAddDialogOpen(false);
            setNewDocumentName('');
            setNewImageUrl('');
        }
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
                        setNewDocumentName('');
                        setNewImageUrl('');
                        setIsAddDialogOpen(true);
                    }}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Document
                </Button>
            </CardHeader>
            <CardContent>
                <div className="flex w-full items-center space-x-2 mb-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                                onClick={() => handleEditDocument(doc)}
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
            </CardContent>

            {/* Edit Document Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Document</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Document Name</label>
                            <Input
                                value={newDocumentName}
                                onChange={(e) => setNewDocumentName(e.target.value)}
                                placeholder="Document name"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Image URL</label>
                            <Input
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                placeholder="Image URL"
                            />
                        </div>
                        {newImageUrl && (
                            <div className="h-40 w-full bg-gray-100 rounded overflow-hidden">
                                <img
                                    src={newImageUrl}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/api/placeholder/200/150";
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Document Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Document</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Document Name (Optional)</label>
                            <Input
                                value={newDocumentName}
                                onChange={(e) => setNewDocumentName(e.target.value)}
                                placeholder="Document name"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Image URL</label>
                            <Input
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                placeholder="Image URL"
                                required
                            />
                        </div>
                        {newImageUrl && (
                            <div className="h-40 w-full bg-gray-100 rounded overflow-hidden">
                                <img
                                    src={newImageUrl}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/api/placeholder/200/150";
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddDocument} disabled={!newImageUrl.trim()}>
                            Add Document
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Document Preview Dialog */}
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
        </Card>
    );
};