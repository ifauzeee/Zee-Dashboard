
import { useState, useEffect, useRef } from 'react';
import { useClashStore } from '@/store/useClashStore';

export interface Log {
    id: string;
    type: 'info' | 'warning' | 'error' | 'debug' | string;
    payload: string;
    time: string;
}

export function useLogs() {
    const { host, port, secret, isConnected } = useClashStore();
    const [logs, setLogs] = useState<Log[]>([]);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!isConnected || !host || !port) return;

        if (ws.current) {
            ws.current.close();
        }

        const wsUrl = `ws://${host}:${port}/logs?level=info&token=${encodeURIComponent(secret)}`;

        try {
            const socket = new WebSocket(wsUrl);
            ws.current = socket;

            socket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);

                    const now = new Date();
                    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

                    const newLog: Log = {
                        id: Math.random().toString(36).substr(2, 9),
                        type: message.type,
                        payload: message.payload,
                        time: timeStr
                    };

                    setLogs(prev => {
                        const newLogs = [...prev, newLog];
                        if (newLogs.length > 200) return newLogs.slice(newLogs.length - 200);
                        return newLogs;
                    });
                } catch {
                }
            };

            socket.onerror = (e) => {
                if (socket.readyState !== WebSocket.CLOSED) {
                    console.error('Logs WebSocket Error:', e);
                }
            };
        } catch (err) {
            console.error("WS Logs Init Error", err);
        }

        return () => {
            if (ws.current) {
                ws.current.close();
                ws.current = null;
            }
        };
    }, [host, port, secret, isConnected]);

    const clearLogs = () => setLogs([]);

    return { logs, clearLogs };
}
