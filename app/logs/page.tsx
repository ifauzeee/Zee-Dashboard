'use client';

import { motion } from 'framer-motion';
import { Trash2, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useLogs } from '@/components/hooks/useLogs';

export default function LogsPage() {
    const { logs, clearLogs } = useLogs();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('All');

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            if (filterLevel !== 'All' && log.type.toLowerCase() !== filterLevel.toLowerCase()) return false;
            if (searchTerm && !log.payload.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            return true;
        });
    }, [logs, filterLevel, searchTerm]);

    return (
        <div className="h-full flex flex-col space-y-4 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-white"
                    >
                        Logs
                    </motion.h1>
                    <p className="text-gray-400 mt-1">System activity and events</p>
                </div>

                <div className="flex gap-2">
                    <div className="flex bg-white/5 rounded-lg border border-white/5 p-1">
                        <button
                            onClick={clearLogs}
                            className="p-2 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors"
                            title="Clear Logs"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search logs..."
                            className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
                        />
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl flex-1 overflow-hidden flex flex-col font-mono text-sm max-h-[600px]"
            >
                <div className="p-4 border-b border-white/5 flex gap-2 overflow-x-auto">
                    {['All', 'Info', 'Warning', 'Error', 'Debug'].map(level => (
                        <button
                            key={level}
                            onClick={() => setFilterLevel(level)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${filterLevel === level
                                ? 'bg-white/10 border-white/10 text-white'
                                : 'bg-transparent border-white/5 text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar flex flex-col-reverse">
                    {filteredLogs.length === 0 ? (
                        <div className="text-gray-600 text-center py-10">No logs to display...</div>
                    ) : (
                        filteredLogs.slice().reverse().map((log) => (
                            <div key={log.id} className="flex gap-4 hover:bg-white/5 p-1 rounded transition-colors group">
                                <span className="text-gray-600 select-none min-w-[70px]">{log.time}</span>
                                <span className={`uppercase text-xs font-bold w-16 text-center rounded px-1 py-0.5 select-none ${log.type === 'info' ? 'bg-blue-500/10 text-blue-400' :
                                    log.type === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
                                        log.type === 'error' ? 'bg-red-500/10 text-red-400' :
                                            'bg-gray-500/10 text-gray-400'
                                    }`}>
                                    {log.type}
                                </span>
                                <span className="text-gray-300 group-hover:text-white break-all">
                                    {log.payload}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
}
