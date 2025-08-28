import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Check, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

// Type definitions
interface FileObject {
    file: File;
    id: string;
    preview: string;
    name: string;
    size: number;
    type: string;
}

interface CameraUploadComponentProps {
    onFilesChange?: (files: FileObject[]) => void;
    onUpload?: (files: FileObject[]) => Promise<void> | void;
    maxFileSize?: number; // in bytes
    acceptedTypes?: string[];
    maxFiles?: number;
    className?: string;
    needUploadButton?: boolean;
}

const CameraUploadComponent: React.FC<CameraUploadComponentProps> = ({
    onFilesChange,
    onUpload,
    maxFileSize = 10 * 1024 * 1024, // 10MB default
    acceptedTypes = ['image/*', 'video/*'],
    maxFiles = 10,
    className = '',
    needUploadButton = false
}) => {
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const [files, setFiles] = useState<FileObject[]>([]);
    const [showCamera, setShowCamera] = useState<boolean>(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Validate file type
    const isValidFileType = useCallback((file: File): boolean => {
        return acceptedTypes.some(type => {
            if (type.endsWith('/*')) {
                return file.type.startsWith(type.slice(0, -1));
            }
            return file.type === type;
        });
    }, [acceptedTypes]);

    // Handle file upload with validation
    const handleFiles = useCallback((newFiles: FileList | File[]): void => {
        const fileArray = Array.from(newFiles);

        // Filter and validate files
        const validFiles = fileArray.filter(file => {
            if (!isValidFileType(file)) {
                console.warn(`File ${file.name} is not a supported type`);
                return false;
            }

            if (file.size > maxFileSize) {
                console.warn(`File ${file.name} is too large (${formatFileSize(file.size)})`);
                return false;
            }

            return true;
        });

        // Check max files limit
        const remainingSlots = maxFiles - files.length;
        const filesToAdd = validFiles.slice(0, remainingSlots);

        if (filesToAdd.length < validFiles.length) {
            console.warn(`Only adding ${filesToAdd.length} files due to maximum limit of ${maxFiles}`);
        }

        const fileObjects: FileObject[] = filesToAdd.map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            preview: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            type: file.type
        }));

        setFiles(prev => {
            const updatedFiles = [...prev, ...fileObjects];
            onFilesChange?.(updatedFiles);
            return updatedFiles;
        });
    }, [files.length, isValidFileType, maxFileSize, maxFiles, onFilesChange]);

    // Drag and drop handlers
    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            handleFiles(droppedFiles);
        }
    }, [handleFiles]);

    // File input handler
    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files?.length) {
            handleFiles(e.target.files);
        }
    }, [handleFiles]);

    // Camera handlers
    const startCamera = useCallback(async (): Promise<void> => {
        try {
            // Check if getUserMedia is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                toast.error('Camera access is not supported in this browser.');
                return;
            }

            setShowCamera(true); // Show modal first

            const constraints: MediaStreamConstraints = {
                video: {
                    facingMode: { ideal: 'environment' }, // Try back camera first, fallback to any
                    width: { ideal: 1280, max: 1920 },
                    height: { ideal: 720, max: 1080 }
                },
                audio: false
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);

            // Wait a bit for the video element to be ready
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.play().catch(console.error);
                }
            }, 100);

        } catch (error) {
            console.error('Error accessing camera:', error);
            setShowCamera(false); // Hide modal if camera fails

            // Provide more specific error messages
            if (error instanceof Error) {
                if (error.name === 'NotAllowedError') {
                    toast.error('Camera access denied. Please allow camera permissions and try again.');
                } else if (error.name === 'NotFoundError') {
                    toast.error('No camera found on this device.');
                } else if (error.name === 'NotSupportedError') {
                    toast.error('Camera is not supported on this device.');
                } else if (error.name === 'OverconstrainedError') {
                    // Try again with less restrictive constraints
                    try {
                        const fallbackStream = await navigator.mediaDevices.getUserMedia({
                            video: true,
                            audio: false
                        });
                        setStream(fallbackStream);
                        setShowCamera(true);

                        setTimeout(() => {
                            if (videoRef.current) {
                                videoRef.current.srcObject = fallbackStream;
                                videoRef.current.play().catch(console.error);
                            }
                        }, 100);
                    } catch (_fallbackError) {
                        toast.error('Unable to access camera with any settings.');
                    }
                } else {
                    toast.error(`Camera error: ${error.message}`);
                }
            } else {
                toast.error('Unable to access camera. Please check permissions.');
            }
        }
    }, []);

    const stopCamera = useCallback((): void => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setShowCamera(false);
    }, [stream]);

    const capturePhoto = useCallback((): void => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (!context) {
                console.error('Unable to get canvas context');
                toast.error('Unable to capture photo. Canvas not supported.');
                return;
            }

            // Check if video is playing and has dimensions
            if (video.videoWidth === 0 || video.videoHeight === 0) {
                toast.error('Camera not ready yet. Please wait a moment and try again.');
                return;
            }

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw the current video frame to canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas to blob and create file
            canvas.toBlob((blob) => {
                if (blob) {
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const file = new File([blob], `camera-capture-${timestamp}.jpg`, {
                        type: 'image/jpeg'
                    });
                    handleFiles([file]);
                    stopCamera();
                } else {
                    toast.error('Failed to capture photo. Please try again.');
                }
            }, 'image/jpeg', 0.9);
        }
    }, [handleFiles, stopCamera]);

    // Remove file
    const removeFile = useCallback((id: string): void => {
        setFiles(prev => {
            const fileToRemove = prev.find(f => f.id === id);
            if (fileToRemove) {
                URL.revokeObjectURL(fileToRemove.preview);
            }

            const updatedFiles = prev.filter(f => f.id !== id);
            onFilesChange?.(updatedFiles);
            return updatedFiles;
        });
    }, [onFilesChange]);

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Handle upload
    const handleUpload = useCallback(async (): Promise<void> => {
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            if (onUpload) {
                await onUpload(files);
            } else {
                toast.success(`Ready to upload ${files.length} file(s)`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    }, [files, onUpload]);

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            // Cleanup object URLs
            files.forEach(file => URL.revokeObjectURL(file.preview));

            // Stop camera stream
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const acceptAttribute = acceptedTypes.join(',');

    return (
        <div className={`w-full max-w-2xl mx-auto p-4 space-y-4 ${className}`}>
            {/* Camera Modal */}
            {showCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md">
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Take Photo</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={stopCamera}
                                        type="button"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="relative bg-black rounded-lg overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-64 object-cover"
                                        onLoadedMetadata={() => {
                                            // Ensure video starts playing
                                            if (videoRef.current) {
                                                videoRef.current.play().catch(console.error);
                                            }
                                        }}
                                    />
                                    {/* Loading indicator */}
                                    {!stream && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                                            <div className="text-white text-sm">Starting camera...</div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-center gap-2">
                                    <Button
                                        onClick={capturePhoto}
                                        size="lg"
                                        type="button"
                                        disabled={!stream}
                                        className="flex-1"
                                    >
                                        <Camera className="h-5 w-5 mr-2" />
                                        Capture Photo
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={stopCamera}
                                        size="lg"
                                        type="button"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Hidden canvas for photo capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Upload Area */}
            <Card className={`transition-colors duration-200 ${isDragOver ? 'border-primary bg-primary/5' : 'border-dashed border-2'
                }`}>
                <CardContent
                    className="p-8 text-center cursor-pointer"
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <div className="p-4 bg-primary/10 rounded-full">
                                <Upload className="h-8 w-8 text-primary" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                Drop files here or click to upload
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Supports {acceptedTypes.join(', ')} up to {formatFileSize(maxFileSize)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Maximum {maxFiles} files ({files.length}/{maxFiles} uploaded)
                            </p>
                        </div>

                        <div className="flex gap-2 justify-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                                disabled={files.length >= maxFiles}
                                type="button"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Choose Files
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    startCamera();
                                }}
                                disabled={files.length >= maxFiles}
                                type="button"
                            >
                                <Camera className="h-4 w-4 mr-2" />
                                Take Photo
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={acceptAttribute}
                onChange={handleFileInput}
                className="hidden"
            />

            {/* File List */}
            {files.length > 0 && (
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            Selected Files ({files.length})
                        </h3>
                        <div className="space-y-3">
                            {files.map((fileObj) => (
                                <div
                                    key={fileObj.id}
                                    className="flex items-center gap-3 p-3 border rounded-lg"
                                >
                                    {/* File Preview */}
                                    <div className="flex-shrink-0">
                                        {fileObj.type.startsWith('image/') ? (
                                            <img
                                                src={fileObj.preview}
                                                alt={fileObj.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    {/* File Info */}
                                    <div className="flex-grow min-w-0">
                                        <p className="text-sm font-medium truncate" title={fileObj.name}>
                                            {fileObj.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatFileSize(fileObj.size)} • {fileObj.type}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center text-green-600">
                                            <Check className="h-4 w-4 mr-1" />
                                            <span className="text-xs">Ready</span>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeFile(fileObj.id)}
                                            disabled={isUploading}
                                            type="button"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Upload Button */}
                        <div className="mt-4 pt-4 border-t" hidden={!needUploadButton}>
                            <Button
                                className="w-full"
                                onClick={handleUpload}
                                disabled={isUploading || files.length === 0}
                                type="button"
                            >
                                {isUploading ? 'Uploading...' : `Upload ${files.length} file${files.length !== 1 ? 's' : ''}`}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default CameraUploadComponent;