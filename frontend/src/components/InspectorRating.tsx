import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { ReviewService } from "@/services/review.service";

interface InspectorRatingProps {
    inspectorId: string;
}

export function InspectorRating({ inspectorId }: InspectorRatingProps) {
    const [rating, setRating] = useState({
        averageRating: 0,
        totalReviews: 0
    });

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const data = await ReviewService.getInspectorRating(inspectorId);
                setRating(data);
            } catch (error) {
                console.error("Error fetching inspector rating:", error);
            }
        };

        fetchRating();
    }, [inspectorId]);

    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-5 w-5 ${star <= Math.round(rating.averageRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                    />
                ))}
            </div>
            <div className="text-sm text-gray-600">
                {rating.averageRating.toFixed(1)} ({rating.totalReviews} reviews)
            </div>
        </div>
    );
}