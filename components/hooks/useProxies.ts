
import { useState, useEffect } from 'react';
import { useClashStore } from '@/store/useClashStore';

interface ProxyItem {
    name: string;
    type: string;
    history: { time: string; delay: number }[];
    udp: boolean;
    now?: string;
    alive?: boolean;
}

interface ProxyGroupData {
    name: string;
    type: string;
    all: string[];
    now: string;
}

interface ProcessedGroup {
    name: string;
    type: string;
    now: string;
    proxies: { name: string; type: string; delay: number }[];
}

export function useProxies() {
    const { host, port, secret, isConnected } = useClashStore();
    const [proxyGroups, setProxyGroups] = useState<ProcessedGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProxies = async () => {
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
                const proxies: Record<string, ProxyItem | ProxyGroupData> = data.proxies;

                const groups: ProcessedGroup[] = [];

                Object.values(proxies).forEach((item: unknown) => {
                    const groupItem = item as ProxyGroupData;
                    if (groupItem.all && groupItem.all.length > 0) {
                        const subProxies = groupItem.all.map((proxyName: string) => {
                            const proxyNode = proxies[proxyName] as ProxyItem;
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
                            now: groupItem.now,
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
        };

        fetchProxies();
        const interval = setInterval(fetchProxies, 2000);
        return () => clearInterval(interval);
    }, [host, port, secret, isConnected]);

    return { proxyGroups, isLoading };
}
