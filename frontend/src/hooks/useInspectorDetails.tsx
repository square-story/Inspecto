import { setInspector } from "@/features/inspector/inspectorSlice";
import { inspectorService } from "@/services/inspector.service";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useInspectorDetails = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch()
    const inspector = useSelector((state: RootState) => state.inspector)

    useEffect(() => {
        const featchInspector = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await inspectorService.getProfile();
                dispatch(setInspector(response.data));
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch user details");
            } finally {
                setLoading(false);
            }
        }
        featchInspector();
    }, [dispatch])

    return { inspector, loading, error }
}