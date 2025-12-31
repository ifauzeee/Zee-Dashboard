'use client';

import { useRef } from 'react';
import { LucideIcon } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface StatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    color?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, color = 'text-primary' }: StatsCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const card = cardRef.current;
        const icon = iconRef.current;

        const hover = gsap.to(card, {
            y: -5,
            duration: 0.3,
            ease: "power2.out",
            paused: true
        });

        const iconSpin = gsap.to(icon, {
            rotation: 360,
            duration: 1,
            ease: "power2.inOut",
            paused: true
        });

        const onEnter = () => {
            hover.play();
            iconSpin.play();
        };

        const onLeave = () => {
            hover.reverse();
            iconSpin.reverse();
        };

        if (card) {
            card.addEventListener('mouseenter', onEnter);
            card.addEventListener('mouseleave', onLeave);
        }

        return () => {
            if (card) {
                card.removeEventListener('mouseenter', onEnter);
                card.removeEventListener('mouseleave', onLeave);
            }
        };
    }, { scope: cardRef });

    return (
        <div
            ref={cardRef}
            className="glass-card rounded-2xl p-6 relative overflow-hidden group cursor-pointer transition-colors hover:border-white/10"
        >
            <div className={`absolute -right-4 -top-4 w-32 h-32 rounded-full opacity-[0.03] group-hover:opacity-10 transition-all duration-500 scale-100 group-hover:scale-110 ${color.replace('text-', 'bg-')}`} />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
                    <div className="text-2xl font-bold mt-1 tracking-tight text-white">{value}</div>
                </div>
                <div ref={iconRef} className={`p-3 rounded-xl bg-white/5 border border-white/10 ${color} shadow-lg shadow-black/20`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            {trend && (
                <div className="flex items-center gap-2 text-xs relative z-10">
                    <span className={`px-1.5 py-0.5 rounded ${trendUp ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {trendUp ? '↑' : '↓'} {trend}
                    </span>
                    <span className="text-gray-500">vs last hour</span>
                </div>
            )}

            {/* Hover sheen effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
    );
}
