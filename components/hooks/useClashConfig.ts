
import { useState, useEffect, useCallback } from 'react';
import { useClashStore } from '@/store/useClashStore';

export interface ClashConfigData {
    port: number;
    'socks-port': number;
    'redir-port': number;
    'tproxy-port': number;
    'mixed-port': number;
    'allow-lan': boolean;
    'bind-address': string;
    mode: 'global' | 'rule' | 'direct' | 'script';
    'log-level': string;
    ipv6: boolean;
}

export function useClashConfig() {
    const { host, port, secret, isConnected } = useClashStore();
    const [config, setConfig] = useState<ClashConfigData | null>(null);

    const fetchConfig = useCallback(async () => {
        if (!isConnected || !host || !port) return;

        try {
            const target = `http://${host}:${port}/configs`;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(target)}`;
            const headers: HeadersInit = {};
            if (secret) headers['Authorization'] = `Bearer ${secret}`;

            const res = await fetch(proxyUrl, { headers });
            if (res.ok) {
                const data = await res.json();
                setConfig(data);
            }
        } catch (err) {
            console.error("Failed to fetch config:", err);
        }
    }, [host, port, secret, isConnected]);

    const updateConfig = async (newConfig: Partial<ClashConfigData>) => {
        if (!isConnected || !host || !port) return;

        try {
            const target = `http://${host}:${port}/configs`;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(target)}`;
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (secret) headers['Authorization'] = `Bearer ${secret}`;

            await fetch(proxyUrl, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(newConfig)
            });
            await fetchConfig();
        } catch (err) {
            console.error("Failed to update config:", err);
        }
    };

    const reloadConfig = async () => {
        if (!isConnected || !host || !port) return;
        try {
            const target = `http://${host}:${port}/configs?force=true`;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(target)}`;
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (secret) headers['Authorization'] = `Bearer ${secret}`;

            await fetch(proxyUrl, { method: 'PUT', headers, body: JSON.stringify({ path: "", payload: "" }) });
        } catch (e) {
            console.error("Reload config failed", e);
        }
    };

    const flushFakeIP = async () => {
        if (!isConnected || !host || !port) return;
        try {
            const target = `http://${host}:${port}/cache/fakeip/flush`;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(target)}`;
            const headers: HeadersInit = {};
            if (secret) headers['Authorization'] = `Bearer ${secret}`;

            await fetch(proxyUrl, { method: 'POST', headers });
        } catch (e) {
            console.error("Flush FakeIP failed", e);
        }
    };

    const restartCore = async () => {
        if (!isConnected || !host || !port) return;
        try {
            const target = `http://${host}:${port}/restart`;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(target)}`;
            const headers: HeadersInit = {};
            if (secret) headers['Authorization'] = `Bearer ${secret}`;

            await fetch(proxyUrl, { method: 'POST', headers });
        } catch (e) {
            console.error("Restart core failed", e);
        }
    }

    const updateProviders = async () => {
        if (!isConnected || !host || !port) return;
        console.warn("Update providers not fully implemented specific per-provider, reloading config instead");
        await reloadConfig();
    }

    useEffect(() => {
        const timeout = setTimeout(fetchConfig, 0);
        return () => clearTimeout(timeout);
    }, [fetchConfig]);

    return {
        config,
        updateConfig,
        reloadConfig,
        flushFakeIP,
        restartCore,
        updateProviders,
        fetchConfig
    };
}
