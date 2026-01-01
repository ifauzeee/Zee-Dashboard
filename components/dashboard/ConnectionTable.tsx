'use client';

import { useRef, useState } from 'react';
import { Globe, Wifi, Twitter, Github, Chrome, MonitorPlay, MessageCircle, X, Search } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { Connection, useConnections } from '@/components/hooks/useConnections';
import { ConnectionDetailsModal } from '@/components/dashboard/ConnectionDetailsModal';

const getIconForHost = (host: string) => {
    if (!host) return <Globe className="w-4 h-4 text-blue-400" />;
    const h = host.toLowerCase();
    if (h.includes('twitter') || h.includes('x.com')) return <Twitter className="w-4 h-4 text-sky-500" />;
    if (h.includes('github')) return <Github className="w-4 h-4 text-gray-900 dark:text-white" />;
    if (h.includes('google')) return <Chrome className="w-4 h-4 text-rose-500" />;
    if (h.includes('netflix')) return <MonitorPlay className="w-4 h-4 text-red-600" />;
    if (h.includes('whatsapp')) return <MessageCircle className="w-4 h-4 text-green-500" />;
    return <Globe className="w-4 h-4 text-blue-400" />;
};

function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function ConnectionTable() {
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef(null);
    const { connections, closeConnection } = useConnections();
    const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);

    const filteredConnections = connections.filter(conn => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        const host = (conn.metadata.host || '').toLowerCase();
        const ip = (conn.metadata.destinationIP || '').toLowerCase();
        const process = (conn.metadata.processPath || '').toLowerCase();
        const type = (conn.metadata.type || '').toLowerCase();

        return host.includes(term) || ip.includes(term) || process.includes(term) || type.includes(term);
    });

    const displayConnections = filteredConnections.slice(0, 50);

    useGSAP(() => {
        gsap.from('.connection-row', {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power3.out'
        });
    }, { scope: containerRef, dependencies: [] });

    return (
        <>
            <div ref={containerRef} className="glass-card rounded-2xl p-6 w-full flex flex-col h-[600px]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Wifi className="w-5 h-5 text-blue-500" />
                        Active Connections
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-normal ml-2 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                            {filteredConnections.length} / {connections.length}
                        </span>
                    </h3>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search host, IP, process..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <Link
                            href="/connections"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors hover:underline flex items-center gap-1 whitespace-nowrap"
                        >
                            View All
                        </Link>
                    </div>
                </div>

                <div className="overflow-auto custom-scrollbar flex-1 relative">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-gray-50 dark:bg-[#0f0f12] z-10 shadow-sm">
                            <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/5">
                                <th className="py-3 px-4 font-medium bg-gray-50 dark:bg-black/20 backdrop-blur-md">Host</th>
                                <th className="py-3 px-4 font-medium hidden sm:table-cell bg-gray-50 dark:bg-black/20 backdrop-blur-md">Type</th>
                                <th className="py-3 px-4 font-medium hidden md:table-cell bg-gray-50 dark:bg-black/20 backdrop-blur-md">Chains</th>
                                <th className="py-3 px-4 font-medium bg-gray-50 dark:bg-black/20 backdrop-blur-md">Speed</th>
                                <th className="py-3 px-4 font-medium text-right hidden lg:table-cell bg-gray-50 dark:bg-black/20 backdrop-blur-md">Download</th>
                                <th className="py-3 px-4 font-medium text-right w-10 bg-gray-50 dark:bg-black/20 backdrop-blur-md"></th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {displayConnections.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 rounded-full bg-gray-100 dark:bg-white/5">
                                                {searchTerm ? <Search className="w-6 h-6 text-gray-400" /> : <Wifi className="w-6 h-6 text-gray-400" />}
                                            </div>
                                            <p>{searchTerm ? 'No connections match your search' : 'No active connections'}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                displayConnections.map((conn) => {
                                    const host = conn.metadata.host || conn.metadata.destinationIP;
                                    return (
                                        <tr
                                            key={conn.id}
                                            onClick={() => setSelectedConnection(conn)}
                                            className="connection-row group hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors border-b border-gray-100 dark:border-white/5 last:border-0"
                                        >
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
                                                        {getIconForHost(host)}
                                                    </div>
                                                    <div className="max-w-[150px] md:max-w-[200px] overflow-hidden">
                                                        <div className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate" title={host}>
                                                            {host}
                                                        </div>
                                                        <div className="text-xs text-gray-600 dark:text-gray-400 truncate flex items-center gap-1">
                                                            <span>{conn.metadata.destinationIP}:{conn.metadata.destinationPort}</span>
                                                            {conn.metadata.processPath && (
                                                                <>
                                                                    <span className="text-gray-400 dark:text-gray-600 mx-1">•</span>
                                                                    <span className="text-gray-600 dark:text-gray-400" title={conn.metadata.processPath}>
                                                                        {conn.metadata.processPath.split('/').pop()}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 hidden sm:table-cell">
                                                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-xs font-mono text-gray-600 dark:text-gray-300">
                                                    {conn.metadata.type}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs hidden md:table-cell">
                                                <div className="truncate max-w-[120px]" title={conn.chains.join(' → ')}>
                                                    {conn.chains[conn.chains.length - 1]}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${conn.speed > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400 dark:bg-gray-600'}`} />
                                                    <span className={`text-xs font-mono ${conn.speed > 1024 * 1024 ? 'text-yellow-600 dark:text-yellow-400 font-bold' : 'text-gray-600 dark:text-gray-300'}`}>
                                                        {formatBytes(conn.speed)}/s
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-right hidden lg:table-cell">
                                                <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                                    {formatBytes(conn.download)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        closeConnection(conn.id);
                                                    }}
                                                    className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Close Connection"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConnectionDetailsModal
                connection={selectedConnection}
                onClose={() => setSelectedConnection(null)}
            />
        </>
    );
}
