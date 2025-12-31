'use client';

import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Globe, Clock, XCircle, Loader2 } from 'lucide-react';
import { useConnections } from '@/components/hooks/useConnections';

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function ConnectionsPage() {
    const { connections, isLoading, closeAllConnections } = useConnections();

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-white"
                    >
                        Active Connections
                    </motion.h1>
                    <p className="text-gray-400 mt-1">Real-time network sessions</p>
                </div>

                <button
                    onClick={closeAllConnections}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg transition-colors"
                >
                    <XCircle className="w-4 h-4" />
                    <span>Close All</span>
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="p-4 text-sm font-medium text-gray-400">Host</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Type</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Rule</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Chain</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Speed</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Traffics</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Start</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading && connections.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-500" />
                                    </td>
                                </tr>
                            ) : connections.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">No active connections</td>
                                </tr>
                            ) : (
                                connections.map((conn) => (
                                    <tr key={conn.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <div className="font-medium text-white max-w-[250px] truncate">{conn.metadata.host || conn.metadata.destinationIP}</div>
                                                    <div className="text-xs text-gray-500">{conn.metadata.destinationIP}:{conn.metadata.destinationPort}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded bg-white/5 text-xs text-gray-300 font-mono">{conn.metadata.type}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-blue-400 text-sm">{conn.rule}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                <span className="text-gray-300">{conn.chains[0]}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-mono text-gray-300">
                                                {formatBytes(conn.speed)}/s
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 text-xs font-mono">
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <ArrowDown className="w-3 h-3" />
                                                    <span>{formatBytes(conn.download)}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-500">
                                                    <ArrowUp className="w-3 h-3" />
                                                    <span>{formatBytes(conn.upload)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                                                <Clock className="w-3 h-3" />
                                                <span>{new Date(conn.start).toLocaleTimeString()}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
