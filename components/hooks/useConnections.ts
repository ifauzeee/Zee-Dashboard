
import { useState, useEffect, useCallback } from 'react';
import { useClashStore } from '@/store/useClashStore';

export interface Connection {
    id: string;
    metadata: {
        network: string;
        type: string;
        sourceIP: string;
        destinationIP: string;
        sourcePort: string;
        destinationPort: string;
        host: string;
        processPath?: string;
    };
    upload: number;
    download: number;
    start: string;
    chains: string[];
    rule: string;
    rulePayload?: string;
    speed: number;
}

export function useConnections() {
    const { host, port, secret, isConnected } = useClashStore();
    const [connections, setConnections] = useState<Connection[]>([]);
    const [uploadTotal, setUploadTotal] = useState(0);
    const [downloadTotal, setDownloadTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchConnections = useCallback(async () => {
        if (!isConnected || !host || !port) {
            setIsLoading(false);
            return;
        }

        try {
            const target = `http://${host}:${port}/connections`;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(target)}`;
            const headers: HeadersInit = {};
            if (secret) headers['Authorization'] = `Bearer ${secret}`;

            const res = await fetch(proxyUrl, { headers });
            const data = await res.json();

            setConnections(data.connections || []);
            setUploadTotal(data.uploadTotal || 0);
            setDownloadTotal(data.downloadTotal || 0);

        } catch (err) {
            console.error("Failed to fetch connections:", err);
        } finally {
            setIsLoading(false);
        }
    }, [host, port, secret, isConnected]);

    const closeAllConnections = async () => {
        if (!isConnected || !host || !port) return;
        try {
            const target = `http://${host}:${port}/connections`;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(target)}`;
            const headers: HeadersInit = {};
            if (secret) headers['Authorization'] = `Bearer ${secret}`;

            await fetch(proxyUrl, {
                method: 'DELETE',
                headers
            });
            fetchConnections();
        } catch (e) {
            console.error("Failed to close all connections", e);
        }
    };

    const closeConnection = async (id: string) => {
        if (!isConnected || !host || !port) return;
        try {
            const target = `http://${host}:${port}/connections/${id}`;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(target)}`;
            const headers: HeadersInit = {};
            if (secret) headers['Authorization'] = `Bearer ${secret}`;

            await fetch(proxyUrl, {
                method: 'DELETE',
                headers
            });
            setConnections(prev => prev.filter(c => c.id !== id));
            setTimeout(fetchConnections, 500);
        } catch (e) {
            console.error(`Failed to close connection ${id}`, e);
        }
    };

    useEffect(() => {
        fetchConnections();
        const interval = setInterval(fetchConnections, 2000);
        return () => clearInterval(interval);
    }, [fetchConnections]);

    return { connections, uploadTotal, downloadTotal, isLoading, closeAllConnections, closeConnection };
}
