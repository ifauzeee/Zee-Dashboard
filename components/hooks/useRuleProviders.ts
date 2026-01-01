
import { useState, useEffect, useCallback } from 'react';
import { useClashStore } from '@/store/useClashStore';

export interface RuleProvider {
    name: string;
    type: string;
    vehicleType: string;
    behavior: string;
    path: string;
    url: string;
    interval: number;
    updatedAt: string;
    ruleCount: number;
}

export function useRuleProviders() {
    const { host, port, secret, isConnected } = useClashStore();
    const [providers, setProviders] = useState<RuleProvider[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProviders = useCallback(async () => {
        if (!isConnected || !host || !port) {
            setIsLoading(false);
            return;
        }

        try {
            const target = `http://${host}:${port}/providers/rules`;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(target)}`;
            const headers: HeadersInit = {};
            if (secret) headers['Authorization'] = `Bearer ${secret}`;

            const res = await fetch(proxyUrl, { headers });
            const data = await res.json();

            if (data.providers) {
                const providersList = Object.values(data.providers) as RuleProvider[];
                providersList.sort((a, b) => a.name.localeCompare(b.name));
                setProviders(providersList);
            }
        } catch (err) {
            console.error("Failed to fetch rule providers:", err);
        } finally {
            setIsLoading(false);
        }
    }, [host, port, secret, isConnected]);

    const updateProvider = async (name: string) => {
        if (!isConnected || !host || !port) return;

        try {
            const target = `http://${host}:${port}/providers/rules/${encodeURIComponent(name)}`;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(target)}`;
            const headers: HeadersInit = {};
            if (secret) headers['Authorization'] = `Bearer ${secret}`;

            await fetch(proxyUrl, { method: 'PUT', headers });
            await fetchProviders();
        } catch (e) {
            console.error(`Failed to update rule provider ${name}`, e);
        }
    };

    const updateAllProviders = async () => {
        await Promise.all(providers.map(p => updateProvider(p.name)));
    };

    useEffect(() => {
        fetchProviders();
    }, [fetchProviders]);

    return { providers, isLoading, updateProvider, updateAllProviders, refresh: fetchProviders };
}
