
import { useState, useEffect } from 'react';
import { useClashStore } from '@/store/useClashStore';

export interface Rule {
    type: string;
    payload: string;
    proxy: string;
    size: number;
}

export function useRules() {
    const { host, port, secret, isConnected } = useClashStore();
    const [rules, setRules] = useState<Rule[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRules = async () => {
            if (!isConnected || !host || !port) {
                setIsLoading(false);
                return;
            }

            try {
                const target = `http://${host}:${port}/rules`;
                const proxyUrl = `/api/proxy?url=${encodeURIComponent(target)}`;
                const headers: HeadersInit = {};
                if (secret) headers['Authorization'] = `Bearer ${secret}`;

                const res = await fetch(proxyUrl, { headers });
                const data = await res.json();

                if (data.rules) {
                    setRules(data.rules);
                }
            } catch (err) {
                console.error("Failed to fetch rules:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRules();
    }, [host, port, secret, isConnected]);

    return { rules, isLoading };
}
