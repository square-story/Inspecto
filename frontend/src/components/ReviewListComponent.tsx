import { IReview } from "@/types/review";
import { format } from "date-fns";
import { Star } from "lucide-react";

interface ReviewListProps {
    reviews: IReview[];
}

export function ReviewList({ reviews }: ReviewListProps) {
    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div key={review._id} className="border rounded-lg p-4 bg-primary shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="font-semibold">{review.user.firstName}</p>
                            <div className="flex gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-4 w-4 ${star <= review.rating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <span className="text-sm text-gray-500">
                            {format(new Date(review.createdAt), 'MMM d, yyyy')}
                        </span>
                    </div>
                    <p className="text-gray-600 mt-2">{review.comment}</p>
                </div>
            ))}
        </div>
    );
}