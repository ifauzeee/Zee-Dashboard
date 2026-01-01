
import { useState, useEffect, useCallback } from 'react';
import { useClashStore } from '@/store/useClashStore';

interface ProxyItem {
    name: string;
    type: string;
    history?: { time: string; delay: number }[];
    udp?: boolean;
    now?: string;
    all?: string[];
}

export interface Proxy {
    name: string;
    type: string;
    delay: number;
}

interface ProcessedGroup {
    name: string;
    type: string;
    now: string;
    proxies: Proxy[];
}

export function useProxies() {
    const { host, port, secret, isConnected } = useClashStore();
    const [proxyGroups, setProxyGroups] = useState<ProcessedGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProxies = useCallback(async () => {
        if (!isConnected || !host || !port) {
            setIsLoading(false);
            return;
        }

        try {
            const target = `http://${host}:${port}/proxies`;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(target)}`;
            const headers: HeadersInit = {};
            if (secret) headers['Authorization'] = `Bearer ${secret}`;

            const res = await fetch(proxyUrl, { headers });
            const data = await res.json();
            const proxies: Record<string, ProxyItem> = data.proxies;

            const groups: ProcessedGroup[] = [];

            Object.values(proxies).forEach((groupItem) => {
                if (groupItem.all && groupItem.all.length > 0) {
                    const subProxies = groupItem.all.map((proxyName: string) => {
                        const proxyNode = proxies[proxyName];
                        if (!proxyNode) return { name: proxyName, type: 'Unknown', delay: 0 };

                        const lastDelay = proxyNode.history && proxyNode.history.length > 0
                            ? proxyNode.history[proxyNode.history.length - 1].delay
                            : 0;

                        return {
                            name: proxyName,
                            type: proxyNode.type,
                            delay: lastDelay
                        };
                    });

                    groups.push({
                        name: groupItem.name,
                        type: groupItem.type,
                        now: groupItem.now || '',
                        proxies: subProxies
                    });
                }
            });
            groups.sort((a) => (a.name === 'GLOBAL' ? -1 : 1));

            setProxyGroups(groups);
        } catch (err) {
            console.error("Failed to fetch proxies:", err);
        } finally {
            setIsLoading(false);
        }
    }, [host, port, secret, isConnected]);

    useEffect(() => {
        fetchProxies();
        const interval = setInterval(fetchProxies, 2000);
        return () => clearInterval(interval);
    }, [fetchProxies]);

    const checkProxyDelay = async (proxyName: string) => {
        if (!isConnected || !host || !port) return;
        try {
            const testUrl = 'http://www.gstatic.com/generate_204';
            const target = `http://${host}:${port}/proxies/${encodeURIComponent(proxyName)}/delay?timeout=5000&url=${encodeURIComponent(testUrl)}`;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(target)}`;
            const headers: HeadersInit = {};
            if (secret) headers['Authorization'] = `Bearer ${secret}`;

            await fetch(proxyUrl, { headers });
            setTimeout(() => fetchProxies(), 500);
        } catch (e) {
            console.error(`Latency test failed for ${proxyName}`, e);
        }
    };



    return { proxyGroups, isLoading, checkProxyDelay, fetchProxies };
}

