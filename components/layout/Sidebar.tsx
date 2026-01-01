'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Globe,
    Settings,
    Activity,
    FileText,
    Menu,
    List,
    Info
} from 'lucide-react';
import { clsx } from 'clsx';
import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTranslations } from 'next-intl';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSelector } from '@/components/ui/LanguageSelector';

const menuItems = [
    { icon: LayoutDashboard, labelKey: 'overview', href: '/' },
    { icon: Globe, labelKey: 'proxies', href: '/proxies' },
    { icon: List, labelKey: 'rules', href: '/rules' },
    { icon: Activity, labelKey: 'connections', href: '/connections' },
    { icon: FileText, labelKey: 'logs', href: '/logs' },
    { icon: Settings, labelKey: 'config', href: '/config' },
    { icon: Info, labelKey: 'about', href: '/about' },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const sidebarRef = useRef(null);
    const logoRef = useRef(null);
    const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const t = useTranslations('nav');

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
            className="h-screen bg-white/50 dark:bg-card/50 glass border-r border-gray-200 dark:border-border flex flex-col z-50 relative overflow-hidden"
            style={{ width: 260 }}
        >

            <div className="h-16 flex items-center px-4 border-b border-gray-100 dark:border-border/50 justify-between shrink-0">
                <div
                    ref={logoRef}
                    className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 shrink-0">
                        Z
                    </div>
                    <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        ZeeBoard
                    </span>
                </div>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors absolute right-4 top-4 z-20"
                >
                    <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" />
                </button>
            </div>


            <nav className="flex-1 py-6 px-3 space-y-2 overflow-x-hidden overflow-y-auto">
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
                                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-50" />
                                )}

                                <div className={clsx("relative z-10 transition-transform duration-300 group-hover:scale-110", isActive && "text-blue-500 dark:text-blue-400")}>
                                    <item.icon className="w-5 h-5" />
                                </div>

                                <span
                                    ref={el => { textRefs.current[index] = el }}
                                    className="font-medium z-10 whitespace-nowrap"
                                >
                                    {t(item.labelKey)}
                                </span>

                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_10px_#3b82f6]" />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>


            <div className={clsx(
                "px-3 py-4 border-t border-gray-100 dark:border-border/50 space-y-3 transition-opacity duration-300",
                isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
                <div className="flex items-center justify-between gap-2">
                    <ThemeToggle />
                    <LanguageSelector />
                </div>
            </div>


            <div className="p-4 border-t border-gray-100 dark:border-border/50 shrink-0">
                <div className={clsx("flex items-center gap-3 transition-all duration-300", isCollapsed ? "justify-center" : "")}>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)] shrink-0" />
                    <div
                        className={clsx("text-xs text-gray-600 dark:text-gray-400 overflow-hidden whitespace-nowrap transition-opacity duration-300", isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto")}
                    >
                        <p>Core: Active</p>
                        <p>v1.0.0</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
