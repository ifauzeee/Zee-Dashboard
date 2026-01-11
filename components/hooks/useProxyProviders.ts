import { useState, useEffect, useCallback } from 'react';
import { useClashStore } from '@/store/useClashStore';
import { Proxy } from './useProxies';

export interface ProxyProvider {
    name: string;
    proxies: Proxy[];
    updatedAt: string;
    vehicleType: string;
    subscriptionInfo?: {
        Upload: number;
        Download: number;
        Total: number;
        Expire: number;
    };
}

export function useProxyProviders() {
    const { host, port, secret, isConnected } = useClashStore();
    const [providers, setProviders] = useState<ProxyProvider[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProviders = useCallback(async () => {
        if (!isConnected || !host || !port) {
            setIsLoading(false);
            return;
        }

        try {
            const target = `http://${host}:${port}/providers/proxies`;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(target)}`;
            const headers: HeadersInit = {};
            if (secret) headers['Authorization'] = `Bearer ${secret}`;

            const res = await fetch(proxyUrl, { headers });
            const data = await res.json();

            if (data.providers) {
                let providersList = Object.values(data.providers).map((provider: unknown) => {
                    interface RawProxyData {
                        history?: { delay: number }[];
                        [key: string]: unknown;
                    }

                    const p = provider as ProxyProvider & { proxies: RawProxyData[] };
                    return {
                        ...p,
                        proxies: (p.proxies || []).map((proxy: RawProxyData) => {
                            const lastDelay = (proxy.history && proxy.history.length > 0)
                                ? proxy.history[proxy.history.length - 1].delay
                                : 0;
                            return {
                                ...proxy,
                                delay: lastDelay
                            };
                        })
                    };
                }) as ProxyProvider[];

                providersList = providersList.filter(p => p.vehicleType !== 'Compatible');
                providersList.sort((a, b) => a.name.localeCompare(b.name));
                setProviders(providersList);
            }
        } catch (err) {
            console.error("Failed to fetch proxy providers:", err);
        } finally {
            setIsLoading(false);
        }
    }, [host, port, secret, isConnected]);

    const updateProvider = async (name: string) => {
        if (!isConnected || !host || !port) return;

        try {
            const target = `http://${host}:${port}/providers/proxies/${encodeURIComponent(name)}`;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(target)}`;
            const headers: HeadersInit = {};
            if (secret) headers['Authorization'] = `Bearer ${secret}`;

            await fetch(proxyUrl, { method: 'PUT', headers });
            await fetchProviders();
        } catch (e) {
            console.error(`Failed to update provider ${name}`, e);
        }
    };

    const updateAllProviders = async () => {
        await Promise.all(providers.map(p => updateProvider(p.name)));
    };

    useEffect(() => {
        fetchProviders();
    }, [fetchProviders]);

    return {
        providers,
        isLoading,
        updateProvider,
        updateAllProviders,
        refresh: fetchProviders
    };
}