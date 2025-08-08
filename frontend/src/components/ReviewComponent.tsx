import { RootState } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Star } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ReviewService } from "@/services/review.service";
import { IReview } from "@/types/review";

const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().min(10, 'comment must be at least 10 characters'),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>


interface ReviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    inspectionId: string;
    inspectorId: string;
    existingReview?: IReview;
}

export function ReviewDialog({ open, onOpenChange, inspectionId, inspectorId, existingReview }: ReviewDialogProps) {
    const [hoveredRating, setHoveredRating] = useState(0);
    const user = useSelector((state: RootState) => state.user)

    const form = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            comment: "",
            rating: 0
        }
    })

    // Update the onSubmit function
    const onSubmit = async (values: ReviewFormValues) => {
        try {
            await ReviewService.createReview(values, user._id, inspectorId, inspectionId);
            toast.success("Review submitted successfully!");
            onOpenChange(false);
            form.reset();
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(`Failed to submit review: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{existingReview ? "Your Review" : "Leave a Review"}</DialogTitle>
                    <DialogDescription>
                        {existingReview
                            ? "Here's the review you submitted for this inspection."
                            : "Share your experience with this inspection."}
                    </DialogDescription>
                </DialogHeader>
                {existingReview ? (
                    // Display existing review
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-6 w-6 ${star <= existingReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>
                            <span className="ml-2 text-sm text-muted-foreground">
                                {new Date(existingReview.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-sm">{existingReview.comment}</p>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="rating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rating</FormLabel>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                <Star
                                                    key={rating}
                                                    className={`h-6 w-6 cursor-pointer ${rating <= (hoveredRating || field.value)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                        }`}
                                                    onMouseEnter={() => setHoveredRating(rating)}
                                                    onMouseLeave={() => setHoveredRating(0)}
                                                    onClick={() => field.onChange(rating)}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Review</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Share your experience..."
                                                {...field}
                                                rows={4}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Close
                            </Button>
                            <Button type="submit" className="w-full">
                                Submit Review
                            </Button>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    )
}