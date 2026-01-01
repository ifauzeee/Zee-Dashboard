'use client';

import { motion } from 'framer-motion';
import {
    Github,
    Heart,
    Zap,
    Globe,
    Activity,
    Shield,
    Palette,
    Server,
    ExternalLink,
    Code2,
    Coffee
} from 'lucide-react';
import { useTranslations } from 'next-intl';

const features = [
    { icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Server, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { icon: Shield, color: 'text-green-500', bg: 'bg-green-500/10' },
    { icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { icon: Globe, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { icon: Palette, color: 'text-pink-500', bg: 'bg-pink-500/10' },
];

const techStack = [
    { name: 'Next.js 16', color: 'bg-gray-900 dark:bg-white dark:text-black text-gray-900 dark:text-white' },
    { name: 'React 19', color: 'bg-blue-500 text-gray-900 dark:text-white' },
    { name: 'TypeScript', color: 'bg-blue-600 text-gray-900 dark:text-white' },
    { name: 'Tailwind CSS 4', color: 'bg-cyan-500 text-gray-900 dark:text-white' },
    { name: 'Framer Motion', color: 'bg-purple-500 text-gray-900 dark:text-white' },
    { name: 'GSAP', color: 'bg-green-500 text-gray-900 dark:text-white' },
    { name: 'Zustand', color: 'bg-orange-500 text-gray-900 dark:text-white' },
    { name: 'Recharts', color: 'bg-red-500 text-gray-900 dark:text-white' },
];

export default function AboutPage() {
    const t = useTranslations('about');
    const featureKeys = ['feature1', 'feature2', 'feature3', 'feature4', 'feature5', 'feature6'] as const;

    return (
        <div className="space-y-8 pb-10 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 rounded-2xl"
            >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    {t('features')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                        <motion.div
                            key={featureKeys[index]}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            className="flex items-center gap-4 p-4 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors group"
                        >
                            <div className={`p-3 rounded-xl ${feature.bg} ${feature.color}`}>
                                <feature.icon className="w-5 h-5" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-900 dark:text-white transition-colors">
                                {t(featureKeys[index])}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>


            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 rounded-2xl"
            >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-blue-500" />
                    {t('techStack')}
                </h2>
                <div className="flex flex-wrap gap-3">
                    {techStack.map((tech, index) => (
                        <motion.span
                            key={tech.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                            className={`px-4 py-2 rounded-full text-sm font-medium ${tech.color} shadow-lg`}
                        >
                            {tech.name}
                        </motion.span>
                    ))}
                </div>
            </motion.div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <motion.a
                    href="https://github.com/ifauzeee/zee-dashboard.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Github className="w-5 h-5" />
                            {t('repository')}
                        </h2>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Star on GitHub to support this project!
                    </p>
                </motion.a>


                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="glass-card p-6 rounded-2xl"
                >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        {t('credits')}
                    </h2>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <p>{t('inspiredBy')}</p>
                        <p className="flex items-center gap-2">
                            <Coffee className="w-4 h-4" />
                            Made with ❤️ by Zee
                        </p>
                    </div>
                </motion.div>
            </div>


            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center py-8 border-t border-gray-200 dark:border-white/10"
            >
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t('license')}: <span className="text-gray-800 dark:text-gray-300">MIT License</span>
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                    © 2024-{new Date().getFullYear()} Zee Dashboard. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}
