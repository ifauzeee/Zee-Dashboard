import { useState, useEffect, useRef } from 'react';
import { useClashStore } from '@/store/useClashStore';

interface TrafficData {
    up: number;
    down: number;
}

export function useTraffic() {
    const { host, port, secret, isConnected } = useClashStore();
    const [data, setData] = useState<TrafficData>({ up: 0, down: 0 });
    const [history, setHistory] = useState<{ name: string; up: number; down: number }[]>([]);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!isConnected || !host || !port) return;

        if (ws.current) {
            ws.current.close();
        }

        const wsUrl = `ws://${host}:${port}/traffic?token=${encodeURIComponent(secret)}`;

        try {
            const socket = new WebSocket(wsUrl);
            ws.current = socket;

            socket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    const now = new Date();
                    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

                    setData(message);

                    setHistory(prev => {
                        const newHistory = [...prev, { name: timeStr, up: message.up, down: message.down }];
                        if (newHistory.length > 20) newHistory.shift();
                        return newHistory;
                    });
                } catch {
                }
            };

            socket.onerror = (e) => {
                if (socket.readyState !== WebSocket.CLOSED) {
                    console.error('WebSocket Error:', e);
                }
            };
        } catch (err) {
            console.error("WS Init Error", err);
        }

        return () => {
            if (ws.current) {
                ws.current.close();
                ws.current = null;
            }
        };
    }, [host, port, secret, isConnected]);

    return { current: data, history };
}
