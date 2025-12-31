'use client';

import { motion } from 'framer-motion';
import { Monitor, Smartphone, CheckCircle, XCircle, Link as LinkIcon, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useClashStore } from '@/store/useClashStore';

const ConfigSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">{title}</h2>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

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
        <div className="p-2 rounded-lg bg-white/5 text-gray-400">
            {Icon && <Icon className="w-5 h-5" />}
        </div>
        <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent border-none focus:ring-0 text-white p-0 placeholder-gray-600 font-mono"
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

export default function ConfigPage() {
    const { host, port, secret, isConnected, setConfig, checkConnection } = useClashStore();
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        checkConnection();
    }, [checkConnection]);

    const handleCheck = async () => {
        setIsChecking(true);
        await checkConnection();
        setTimeout(() => setIsChecking(false), 500);
    };

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-white"
                    >
                        Settings
                    </motion.h1>
                    <p className="text-gray-400 mt-1">Configure dashboard connection</p>
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
                        value={host}
                        onChange={(v: string) => setConfig({ host: v })}
                        placeholder="127.0.0.1"
                        icon={Monitor}
                    />
                    <ConfigInput
                        label="Port"
                        value={port}
                        onChange={(v: string) => setConfig({ port: v })}
                        placeholder="9090"
                        icon={LinkIcon}
                    />
                </div>
                <ConfigInput
                    label="API Secret (Optional)"
                    value={secret}
                    onChange={(v: string) => setConfig({ secret: v })}
                    type="password"
                    placeholder="Secret Key"
                    icon={Lock}
                />

                <button
                    onClick={handleCheck}
                    disabled={isChecking}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2"
                >
                    {isChecking ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        isConnected ? <CheckCircle className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />
                    )}
                    {isChecking ? 'Checking...' : isConnected ? 'Connection Verified' : 'Test Connection'}
                </button>

                <ErrorDisplay />
            </ConfigSection>

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
                        <div className="w-px bg-white/5 h-auto self-stretch"></div>
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

            <div className="text-xs text-center text-gray-600 mt-12">
                ZeeBoard v1.18.0 Premium • Connected to {host || '...'}
            </div>
        </div>
    );
}

import { RefreshCw } from 'lucide-react';