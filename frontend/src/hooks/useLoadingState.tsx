import { useState, useCallback } from 'react';

export const useLoadingState = () => {
    const [loading, setLoading] = useState(false);

    const withLoading = useCallback(async (asyncFunction: () => Promise<void>) => {
        setLoading(true);
        try {
            await asyncFunction();
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, withLoading };
};