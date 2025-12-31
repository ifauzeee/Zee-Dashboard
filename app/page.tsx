'use client';

import { useRef } from 'react';
import { ArrowDown, ArrowUp, Activity, Server, Zap, Shield, Globe, Cpu } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TrafficChart } from '@/components/dashboard/TrafficChart';
import { ConnectionTable } from '@/components/dashboard/ConnectionTable';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useConnections } from '@/components/hooks/useConnections';

function formatBytes(bytes: number) {
  if (!+bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}


export default function Home() {
  const container = useRef(null);
  const { connections, uploadTotal, downloadTotal } = useConnections();

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.header-content', {
      y: -30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1
    })
      .from('.mode-toggle', {
        x: 30,
        opacity: 0,
        duration: 0.8
      }, '-=0.6')
      .from('.stats-card', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1
      }, '-=0.4')
      .from('.main-grid', {
        y: 30,
        opacity: 0,
        duration: 0.6
      }, '-=0.2');

  }, { scope: container });

  return (
    <div ref={container} className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="header-content">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-white animate-gradient bg-[length:200%_auto]">
            System Overview
          </h1>
          <p className="text-gray-400 mt-2 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Operational • v2.4.0-stable
          </p>
        </div>

        <div className="mode-toggle bg-black/20 backdrop-blur-xl p-1.5 rounded-xl border border-white/5 flex gap-1">
          {['Global', 'Rule', 'Direct', 'Script'].map((mode) => (
            <button
              key={mode}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group ${mode === 'Rule'
                ? 'text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {mode === 'Rule' && (
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 -z-10" />
              )}
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stats-card">
          <StatsCard
            title="Session Download"
            value={formatBytes(downloadTotal)}
            icon={ArrowDown}
            trend="Active"
            trendUp={true}
            color="text-blue-500"
          />
        </div>
        <div className="stats-card">
          <StatsCard
            title="Session Upload"
            value={formatBytes(uploadTotal)}
            icon={ArrowUp}
            trend="Active"
            trendUp={true}
            color="text-purple-500"
          />
        </div>
        <div className="stats-card">
          <StatsCard
            title="Active Connections"
            value={connections.length.toString()}
            icon={Activity}
            trend="Live"
            trendUp={connections.length > 0}
            color="text-emerald-500"
          />
        </div>
        <div className="stats-card">
          <StatsCard
            title="Memory Usage"
            value="--"
            icon={Server}
            color="text-orange-500"
            trend="N/A"
            trendUp={true}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="main-grid grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TrafficChart />
          <ConnectionTable />
        </div>

        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="glass-card p-6 rounded-2xl flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Quick Actions
            </h3>

            <div className="space-y-3 flex-1">
              {[
                { label: 'Flush DNS Cache', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
                { label: 'Update Providers', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                { label: 'Reload Config', icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
                { label: 'MITM Enabled', icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                { label: 'Restart Service', icon: Server, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
              ].map((action) => (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 hover:translate-x-1 transition-all border border-white/5 group relative overflow-hidden"
                >
                  <div className={`p-2.5 rounded-lg ${action.bg} ${action.color} ring-1 ring-inset ${action.border}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-200 group-hover:text-white transition-colors">{action.label}</span>
                    <span className="text-xs text-gray-500">Click to execute</span>
                  </div>
                  <div className={`absolute right-0 top-0 bottom-0 w-1 ${action.bg.replace('/10', '/50')} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </button>
              ))}
            </div>
          </div>

          {/* System Info Card */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-500" />
              System Resources
            </h3>
            <div className="space-y-4">
              {[
                { label: 'CPU Load', value: '12%', color: 'bg-blue-500' },
                { label: 'RAM Usage', value: '45%', color: 'bg-purple-500' },
                { label: 'Disk Space', value: '28%', color: 'bg-emerald-500' }
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: item.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

