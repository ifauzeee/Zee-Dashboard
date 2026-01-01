'use client';

import { Connection } from '@/components/hooks/useConnections';
import { Modal } from '@/components/ui/Modal';
import {
    Activity,
    ArrowDown,
    ArrowUp,
    Clock,
    Globe,
    HardDrive,
    Hash,
    Link as LinkIcon,
    Network,
    Shield,
    Zap
} from 'lucide-react';

interface ConnectionDetailsModalProps {
    connection: Connection | null;
    onClose: () => void;
}

function DetailRow({ icon: Icon, label, value, mono = false }: { icon: React.ElementType, label: string, value: React.ReactNode, mono?: boolean }) {
    return (
        <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400 mt-0.5">
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{label}</div>
                <div className={`text-sm text-gray-800 dark:text-gray-200 break-all ${mono ? 'font-mono' : ''}`}>
                    {value || 'N/A'}
                </div>
            </div>
        </div>
    );
}

function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function ConnectionDetailsModal({ connection, onClose }: ConnectionDetailsModalProps) {
    if (!connection) return null;

    const { metadata, chains, rule, rulePayload, start, download, upload } = connection;
    const host = metadata.host || metadata.destinationIP;
    const duration = Math.floor((new Date().getTime() - new Date(start).getTime()) / 1000 / 60);

    return (
        <Modal
            isOpen={!!connection}
            onClose={onClose}
            title="Connection Details"
        >
            <div className="space-y-6">
                <div className="bg-gray-100 dark:bg-white/5 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-2 border border-gray-200 dark:border-white/5">
                    <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-2">
                        <Globe className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white break-all max-w-full">
                        {host}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-white/10">{metadata.network}</span>
                        <span>•</span>
                        <span className="font-mono">{metadata.destinationIP}:{metadata.destinationPort}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs">
                            <ArrowDown className="w-4 h-4" />
                            <span>Download</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{formatBytes(download)}</div>
                    </div>
                    <div className="glass-card p-4 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs">
                            <ArrowUp className="w-4 h-4" />
                            <span>Upload</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{formatBytes(upload)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    <DetailRow
                        icon={Activity}
                        label="Process"
                        value={metadata.processPath ? metadata.processPath.split('/').pop() : 'Unknown Process'}
                    />
                    <DetailRow
                        icon={HardDrive}
                        label="Process Path"
                        value={metadata.processPath}
                        mono
                    />
                    <DetailRow
                        icon={Shield}
                        label="Rule"
                        value={`${rule} ${rulePayload ? `(${rulePayload})` : ''}`}
                    />
                    <DetailRow
                        icon={LinkIcon}
                        label="Chains"
                        value={chains.reverse().join(' → ')}
                    />
                    <DetailRow
                        icon={Network}
                        label="Source"
                        value={`${metadata.sourceIP}:${metadata.sourcePort}`}
                        mono
                    />
                    <DetailRow
                        icon={Clock}
                        label="Start Time"
                        value={`${new Date(start).toLocaleTimeString()} (${duration} mins ago)`}
                    />
                    <DetailRow
                        icon={Hash}
                        label="Connection ID"
                        value={connection.id}
                        mono
                    />
                    <DetailRow
                        icon={Zap}
                        label="Type"
                        value={metadata.type}
                    />
                </div>
            </div>
        </Modal>
    );
}