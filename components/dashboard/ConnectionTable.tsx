'use client';

import { useRef } from 'react';
import { Globe, Wifi } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const connections = [
    { id: 1, host: 'google.com', ip: '142.250.190.46', type: 'HTTPS', speed: '45ms', method: 'GET', status: 'Active' },
    { id: 2, host: 'api.twitter.com', ip: '104.244.42.1', type: 'WSS', speed: '120ms', method: 'STREAM', status: 'Active' },
    { id: 3, host: 'netflix.com', ip: '52.21.12.33', type: 'HTTPS', speed: '35ms', method: 'GET', status: 'Idle' },
    { id: 4, host: 'github.com', ip: '140.82.112.4', type: 'SSH', speed: '80ms', method: 'POST', status: 'Active' },
    { id: 5, host: 'whatsapp.net', ip: '157.240.22.60', type: 'TCP', speed: '60ms', method: 'CONNECT', status: 'Active' },
];

export function ConnectionTable() {
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.from('.connection-row', {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out'
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="glass-card rounded-2xl p-6 w-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-blue-500" />
                    Active Connections
                </h3>
                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View All</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-sm text-gray-400 border-b border-white/5">
                            <th className="py-3 px-4 font-medium">Host</th>
                            <th className="py-3 px-4 font-medium">Type</th>
                            <th className="py-3 px-4 font-medium">Method</th>
                            <th className="py-3 px-4 font-medium">Latency</th>
                            <th className="py-3 px-4 font-medium text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {connections.map((conn) => (
                            <tr
                                key={conn.id}
                                className="connection-row group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                            >
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-white/5 text-gray-300 group-hover:text-white group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-200 group-hover:text-blue-400 transition-colors">{conn.host}</div>
                                            <div className="text-xs text-gray-500">{conn.ip}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-xs font-mono text-gray-300">
                                        {conn.type}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-gray-400">{conn.method}</td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${parseInt(conn.speed) < 50 ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                                        <span className="text-gray-300">{conn.speed}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${conn.status === 'Active'
                                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                        : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                        }`}>
                                        {conn.status === 'Active' && <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>}
                                        {conn.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
