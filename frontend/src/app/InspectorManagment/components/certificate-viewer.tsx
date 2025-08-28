import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, FileText, Eye } from 'lucide-react';
import { getSecureImageUrl } from '@/utils/cloudinary';
import { useEffect, useState } from 'react';


export default function CertificateItem({ certificate, index }: { certificate: string; index: number }) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                const url = await getSecureImageUrl(certificate);
                setImageUrl(url);
            } catch (error) {
                console.error("Error fetching image URL:", error);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImageUrl();
    }, [certificate]);

    if (!imageUrl) return null;

    if (isLoading) {
        return (
            <Card className="w-full max-w-sm">
                <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full max-w-sm border-red-200">
                <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-md bg-red-100 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-red-900">Certificate {index + 1}</p>
                            <Badge variant="destructive" className="text-xs">
                                Failed to load
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Certificate {index + 1}</p>
                            <Badge variant="secondary" className="text-xs">
                                Available
                            </Badge>
                        </div>
                    </div>

                    <div className="flex space-x-1">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">Certificate {index + 1}</h3>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(imageUrl, '_blank')}
                                        >
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Open Original
                                        </Button>
                                    </div>
                                    <div className="border rounded-lg overflow-hidden">
                                        <img
                                            src={imageUrl}
                                            alt={`Certificate ${index + 1}`}
                                            className="w-full h-auto"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(imageUrl, '_blank')}
                        >
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
