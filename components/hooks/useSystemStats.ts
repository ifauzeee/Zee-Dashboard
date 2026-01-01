import { useState, useEffect } from 'react';
import { useClashStore } from '@/store/useClashStore';

export function useSystemStats() {
    const { host, port, secret, isConnected } = useClashStore();
    const [memory, setMemory] = useState<{ current: number, total: number }>({ current: 0, total: 0 });

    useEffect(() => {
        if (!isConnected || !host || !port) return;

        const wsEndpoint = `ws://${host}:${port}/memory?token=${encodeURIComponent(secret)}`;
        let ws: WebSocket;

        try {
            ws = new WebSocket(wsEndpoint);
            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data && typeof data.inuse === 'number') {
                        setMemory({
                            current: data.inuse,
                            total: data.oslimit || 0
                        });
                    }
                } catch (e) {
                    console.error("Failed to parse memory data", e);
                }
            };
        } catch (e) {
            console.error("Failed to connect to memory WS", e);
        }

        return () => {
            if (ws) ws.close();
        };
    }, [host, port, secret, isConnected]);

    return { memory };
}