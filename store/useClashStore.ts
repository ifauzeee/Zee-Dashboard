import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ClashConfig {
    host: string;
    port: string;
    secret: string;
    isConnected: boolean;
    error: string | null;
}

interface ProxySettings {
    sortBy: 'name' | 'delay' | 'original';
    groupByProvider: boolean;
    hideUnavailable: boolean;
    autoDisconnect: boolean;
    showOutbound: boolean;
    cardMinWidth: number;
    hiddenGroups: string[];
}

interface ClashStore extends ClashConfig {
    proxySettings: ProxySettings;
    setConfig: (config: Partial<ClashConfig>) => void;
    setProxySettings: (settings: Partial<ProxySettings>) => void;
    checkConnection: () => Promise<boolean>;
}

export const useClashStore = create<ClashStore>()(
    persist(
        (set, get) => ({
            host: '127.0.0.1',
            port: '9090',
            secret: '',
            isConnected: false,
            error: null,

            proxySettings: {
                sortBy: 'original',
                groupByProvider: false,
                hideUnavailable: false,
                autoDisconnect: false,
                showOutbound: false,
                cardMinWidth: 280,
                hiddenGroups: []
            },

            setConfig: (newConfig) => set((state) => ({ ...state, ...newConfig, error: null })),
            setProxySettings: (newSettings) => set((state) => ({
                proxySettings: { ...state.proxySettings, ...newSettings }
            })),

            checkConnection: async () => {
                const { host, port, secret } = get();
                const target = `http://${host}:${port}/version`;
                const proxyUrl = `/api/proxy?url=${encodeURIComponent(target)}`;

                try {
                    const headers: HeadersInit = {};
                    if (secret) {
                        headers['Authorization'] = `Bearer ${secret}`;
                    }

                    const res = await fetch(proxyUrl, {
                        headers: headers
                    });

                    if (res.ok) {
                        set({ isConnected: true, error: null });
                        return true;
                    }

                    let errorMsg = `Connection failed (Status: ${res.status})`;
                    try {
                        const data = await res.json();
                        if (data.details) errorMsg = data.details;
                        else if (data.error) errorMsg = data.error;
                    } catch {
                    }

                    console.warn('Connection failed:', errorMsg);
                    set({ isConnected: false, error: errorMsg });
                    return false;
                } catch (error: unknown) {
                    console.error('Connection failed:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Network Error';
                    set({ isConnected: false, error: errorMessage });
                    return false;
                }
            },
        }),
        {
            name: 'clash-config',
        }
    )
);
