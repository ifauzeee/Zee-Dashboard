'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUp, Globe, Clock, XCircle, Loader2 } from 'lucide-react';
import { useConnections } from '@/components/hooks/useConnections';
import { useState, useEffect } from 'react';

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function ConnectionsPage() {
    const { connections, isLoading, closeAllConnections, closeConnection } = useConnections();
    const [selectedConnId, setSelectedConnId] = useState<string | null>(null);
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const selectedConn = connections.find(c => c.id === selectedConnId);

    return (
        <div className="space-y-6 pb-20 relative">
            <div className="flex justify-between items-end">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-gray-900 dark:text-white"
                    >
                        Active Connections
                    </motion.h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time network sessions</p>
                </div>

                <div className="flex gap-2">
                    <div className="bg-gray-100 dark:bg-white/5 rounded-lg px-3 py-2 text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/5">
                        Total Speed: <span className="text-gray-900 dark:text-white font-mono">{formatBytes(connections.reduce((acc, curr) => acc + curr.speed, 0))}/s</span>
                    </div>
                    <button
                        onClick={closeAllConnections}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg transition-colors"
                    >
                        <XCircle className="w-4 h-4" />
                        <span>Close All</span>
                    </button>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Host</th>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Rule</th>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Chain</th>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Speed</th>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Traffics</th>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Start</th>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {isLoading && connections.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-500" />
                                    </td>
                                </tr>
                            ) : connections.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-500">No active connections</td>
                                </tr>
                            ) : (
                                connections.map((conn) => (
                                    <tr
                                        key={conn.id}
                                        onClick={() => setSelectedConnId(conn.id)}
                                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white max-w-[200px] truncate" title={conn.metadata.host}>{conn.metadata.host || conn.metadata.destinationIP}</div>
                                                    <div className="text-xs text-gray-500">{conn.metadata.destinationIP}:{conn.metadata.destinationPort}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-white/5 text-xs text-gray-600 dark:text-gray-300 font-mono">{conn.metadata.type}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-blue-400 text-sm">{conn.rule}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                <span className="text-gray-700 dark:text-gray-300">{conn.chains[0]}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
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
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => closeConnection(conn.id)}
                                                className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                                title="Disconnect"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <AnimatePresence>
                {selectedConn && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={() => setSelectedConnId(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-[#1a1b26] border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-200 dark:border-white/5 flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Connection Details</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{selectedConn.id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedConnId(null)}
                                    className="p-1 text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Host</label>
                                        <div className="text-gray-900 dark:text-white mt-1 break-all">{selectedConn.metadata.host || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Destination</label>
                                        <div className="text-gray-900 dark:text-white mt-1 font-mono">{selectedConn.metadata.destinationIP}:{selectedConn.metadata.destinationPort}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Source</label>
                                        <div className="text-gray-900 dark:text-white mt-1 font-mono">{selectedConn.metadata.sourceIP}:{selectedConn.metadata.sourcePort}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Type</label>
                                        <div className="text-gray-900 dark:text-white mt-1">{selectedConn.metadata.network} / {selectedConn.metadata.type}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Rule</label>
                                        <div className="text-blue-500 dark:text-blue-400 mt-1">{selectedConn.rule}</div>
                                        <div className="text-xs text-gray-600 mt-0.5">{selectedConn.rulePayload}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Timing</label>
                                        <div className="text-gray-900 dark:text-white mt-1">{new Date(selectedConn.start).toLocaleString()}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">Duration: {Math.floor((now - new Date(selectedConn.start).getTime()) / 1000)}s</div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-2">Proxy Chain</label>
                                    <div className="space-y-2">
                                        {selectedConn.chains.slice().reverse().map((node, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'}`}></div>
                                                    {i !== selectedConn.chains.length - 1 && <div className="w-px h-6 bg-gray-200 dark:bg-white/10 my-0.5"></div>}
                                                </div>
                                                <span className={`text-sm ${i === 0 ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>{node}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 dark:bg-black/20 border-t border-gray-200 dark:border-white/5 flex justify-end">
                                <button
                                    onClick={() => {
                                        closeConnection(selectedConn.id);
                                        setSelectedConnId(null);
                                    }}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-500/20"
                                >
                                    Close Connection
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
