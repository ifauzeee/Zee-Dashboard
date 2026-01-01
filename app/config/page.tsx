'use client';

import { motion } from 'framer-motion';
import {
    Monitor,
    Smartphone,
    CheckCircle,
    XCircle,
    Link as LinkIcon,
    Lock,
    RefreshCw,
    Network,
    Power
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useClashStore } from '@/store/useClashStore';
import { useClashConfig } from '@/components/hooks/useClashConfig';
import { Switch } from '@/components/ui/Switch';

const ConfigSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">{title}</h2>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

const ActionsConfigSection = () => {
    const { reloadConfig, flushFakeIP, restartCore } = useClashConfig();
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    const handleAction = async (action: string, fn: () => Promise<void>) => {
        setLoadingAction(action);
        await fn();
        setTimeout(() => setLoadingAction(null), 1000);
    };

    return (
        <ConfigSection title="Actions">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={() => handleAction('reload', reloadConfig)}
                    disabled={!!loadingAction}
                    className="glass-card p-4 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
                >
                    <div className="p-3 rounded-full bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
                        <RefreshCw className={`w-6 h-6 ${loadingAction === 'reload' ? 'animate-spin' : ''}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reload Config</span>
                </button>
                <button
                    onClick={() => handleAction('flush', flushFakeIP)}
                    disabled={!!loadingAction}
                    className="glass-card p-4 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
                >
                    <div className="p-3 rounded-full bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 group-hover:scale-110 transition-all">
                        <Network className={`w-6 h-6 ${loadingAction === 'flush' ? 'animate-spin' : ''}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Flush FakeIP</span>
                </button>
                <button
                    onClick={() => handleAction('restart', restartCore)}
                    disabled={!!loadingAction}
                    className="glass-card p-4 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
                >
                    <div className="p-3 rounded-full bg-red-500/10 text-red-400 group-hover:bg-red-500/20 group-hover:scale-110 transition-all">
                        <Power className={`w-6 h-6 ${loadingAction === 'restart' ? 'animate-spin' : ''}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Restart Core</span>
                </button>
            </div>
        </ConfigSection>
    );
};

interface ConfigInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    icon?: React.ElementType;
}

const ConfigInput = ({ label, value, onChange, type = "text", placeholder, icon: Icon }: ConfigInputProps) => (
    <div className="glass-card p-4 rounded-xl flex items-center gap-4">
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
            {Icon && <Icon className="w-5 h-5" />}
        </div>
        <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white p-0 placeholder-gray-400 dark:placeholder-gray-600 font-mono"
            />
        </div>
    </div>
);

const ErrorDisplay = () => {
    const { error } = useClashStore();
    if (!error) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm"
        >
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
        </motion.div>
    );
};

const CoreConfigSection = () => {
    const { config, updateConfig } = useClashConfig();

    if (!config) return null;

    return (
        <ConfigSection title="Core Configuration">
            <div className="glass-card p-4 rounded-xl space-y-4">
                <Switch
                    label="Allow LAN"
                    description="Allow other devices to connect"
                    checked={config['allow-lan']}
                    onChange={(v) => updateConfig({ 'allow-lan': v })}
                />

                <div className="w-full h-px bg-gray-200 dark:bg-white/5" />

                <Switch
                    label="IPv6"
                    description="Enable IPv6 support"
                    checked={config.ipv6}
                    onChange={(v) => updateConfig({ ipv6: v })}
                />

                <div className="w-full h-px bg-gray-200 dark:bg-white/5" />

                <div className="flex items-center justify-between py-2">
                    <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Log Level</div>
                        <div className="text-xs text-gray-500 mt-0.5">Console output verbosity</div>
                    </div>
                    <select
                        value={config['log-level']}
                        onChange={(e) => updateConfig({ 'log-level': e.target.value })}
                        className="bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="silent">Silent</option>
                        <option value="error">Error</option>
                        <option value="warning">Warning</option>
                        <option value="info">Info</option>
                        <option value="debug">Debug</option>
                    </select>
                </div>

                <div className="w-full h-px bg-gray-200 dark:bg-white/5" />

                <div className="flex items-center justify-between py-2">
                    <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Mode</div>
                        <div className="text-xs text-gray-500 mt-0.5">Traffic routing mode</div>
                    </div>
                    <select
                        value={config.mode}
                        onChange={(e) => updateConfig({ mode: e.target.value as 'global' | 'rule' | 'direct' | 'script' })}
                        className="bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase"
                    >
                        <option value="global">Global</option>
                        <option value="rule">Rule</option>
                        <option value="direct">Direct</option>
                        <option value="script">Script</option>
                    </select>
                </div>
            </div>
        </ConfigSection>
    )
}

export default function ConfigPage() {
    const { host, port, secret, isConnected, setConfig, checkConnection } = useClashStore();
    const [isChecking, setIsChecking] = useState(false);

    const [formData, setFormData] = useState({
        host: host,
        port: port,
        secret: secret
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFormData(prev => {
                if (prev.host === host && prev.port === port && prev.secret === secret) return prev;
                return { host, port, secret };
            });
        }, 0);
        return () => clearTimeout(timeout);
    }, [host, port, secret]);

    const handleSaveAndConnect = async () => {
        setIsChecking(true);
        setConfig({
            host: formData.host,
            port: formData.port,
            secret: formData.secret
        });

        setTimeout(async () => {
            await checkConnection();
            setIsChecking(false);
        }, 500);
    };

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-gray-900 dark:text-white"
                    >
                        Settings
                    </motion.h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Configure dashboard connection</p>
                </div>

                <div className="flex items-end gap-2">
                    <span className={`text-sm font-medium px-3 py-1 rounded-full border ${isConnected
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
            </div>

            <ConfigSection title="API Connection">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ConfigInput
                        label="Host / IP"
                        value={formData.host}
                        onChange={(v) => setFormData({ ...formData, host: v })}
                        placeholder="127.0.0.1"
                        icon={Monitor}
                    />
                    <ConfigInput
                        label="Port"
                        value={formData.port}
                        onChange={(v) => setFormData({ ...formData, port: v })}
                        placeholder="9090"
                        icon={LinkIcon}
                    />
                </div>
                <ConfigInput
                    label="API Secret (Optional)"
                    value={formData.secret}
                    onChange={(v) => setFormData({ ...formData, secret: v })}
                    type="password"
                    placeholder="Secret Key"
                    icon={Lock}
                />

                <button
                    onClick={handleSaveAndConnect}
                    disabled={isChecking}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2"
                >
                    {isChecking ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        isConnected ? <CheckCircle className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />
                    )}
                    {isChecking ? 'Connecting...' : 'Save & Connect'}
                </button>

                <ErrorDisplay />
            </ConfigSection>

            <ActionsConfigSection />

            <CoreConfigSection />

            <ConfigSection title="External Controller Status">
                <div className="glass-card p-6 rounded-xl text-center space-y-4">
                    <div className="flex justify-center gap-8 text-sm text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                            <Monitor className={`w-8 h-8 transition-colors ${isConnected ? 'text-green-500' : 'text-gray-600'}`} />
                            <span className="text-xs">Dashboard</span>
                            <span className={`font-mono ${isConnected ? 'text-green-400' : 'text-gray-500'}`}>
                                {host}:{port}
                            </span>
                        </div>
                        <div className="w-px bg-gray-200 dark:bg-white/5 h-auto self-stretch"></div>
                        <div className="flex flex-col items-center gap-2">
                            <Smartphone className={`w-8 h-8 transition-colors ${isConnected ? 'text-blue-500' : 'text-gray-600'}`} />
                            <span className="text-xs">Core Status</span>
                            <span className={isConnected ? 'text-blue-400' : 'text-gray-500'}>
                                {isConnected ? 'Online' : 'Offline'}
                            </span>
                        </div>
                    </div>
                </div>
            </ConfigSection>

            <div className="glass-card p-4 rounded-xl border-l-4 border-l-yellow-500/50 mt-8">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Note</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                    Ensure your Clash Core is running and the External Controller is accessible.
                    If you are running Zee Dashboard on a different machine than Clash, make sure `external-controller` binds to `0.0.0.0` or `&lt;Lan-IP&gt;` instead of `127.0.0.1`.
                </p>
            </div>

            <div className="text-xs text-center text-gray-600 mt-12">
                ZeeBoard v1.18.0 Premium • Connected to {host || '...'}
            </div>
        </div>
    );
}