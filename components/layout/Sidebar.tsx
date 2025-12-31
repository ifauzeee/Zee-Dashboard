'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Globe,
    Settings,
    Activity,
    FileText,
    Menu
} from 'lucide-react';
import { clsx } from 'clsx';
import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/' },
    { icon: Globe, label: 'Proxies', href: '/proxies' },
    { icon: Activity, label: 'Connections', href: '/connections' },
    { icon: FileText, label: 'Logs', href: '/logs' },
    { icon: Settings, label: 'Config', href: '/config' },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const sidebarRef = useRef(null);
    const logoRef = useRef(null);
    const textRefs = useRef<(HTMLSpanElement | null)[]>([]);

    useGSAP(() => {
        const width = isCollapsed ? 80 : 260;
        gsap.to(sidebarRef.current, {
            width: width,
            duration: 0.5,
            ease: "power3.inOut"
        });

        if (isCollapsed) {
            gsap.to(logoRef.current, { opacity: 0, x: -20, duration: 0.3 });
            gsap.to(textRefs.current, { opacity: 0, x: -10, duration: 0.2, stagger: 0.05 });
        } else {
            gsap.to(logoRef.current, { opacity: 1, x: 0, duration: 0.5, delay: 0.2 });
            gsap.to(textRefs.current, { opacity: 1, x: 0, duration: 0.4, delay: 0.3, stagger: 0.05 });
        }
    }, { dependencies: [isCollapsed], scope: sidebarRef });

    return (
        <aside
            ref={sidebarRef}
            className="h-screen bg-card/50 glass border-r border-border flex flex-col z-50 relative overflow-hidden"
            style={{ width: 260 }}
        >
            {/* Header */}
            <div className="h-16 flex items-center px-4 border-b border-border/50 justify-between shrink-0">
                <div
                    ref={logoRef}
                    className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 shrink-0">
                        Z
                    </div>
                    <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        ZeeBoard
                    </span>
                </div>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-white/5 rounded-md transition-colors absolute right-4 top-4 z-20"
                >
                    <Menu className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-2 overflow-x-hidden">
                {menuItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block"
                        >
                            <div
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-50" />
                                )}

                                <div className={clsx("relative z-10 transition-transform duration-300 group-hover:scale-110", isActive && "text-blue-400")}>
                                    <item.icon className="w-5 h-5" />
                                </div>

                                <span
                                    ref={el => { textRefs.current[index] = el }}
                                    className="font-medium z-10 whitespace-nowrap"
                                >
                                    {item.label}
                                </span>

                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_10px_#3b82f6]" />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border/50 shrink-0">
                <div className={clsx("flex items-center gap-3 transition-all duration-300", isCollapsed ? "justify-center" : "")}>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)] shrink-0" />
                    <div
                        className={clsx("text-xs text-gray-500 overflow-hidden whitespace-nowrap transition-opacity duration-300", isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto")}
                    >
                        <p>Core: Active</p>
                        <p>v1.18.0 Premium</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
