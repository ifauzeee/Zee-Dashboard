'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

export function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLocale, setCurrentLocale] = useState('en');
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [mounted, setMounted] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const locale = document.cookie
            .split('; ')
            .find(row => row.startsWith('locale='))
            ?.split('=')[1] || 'en';
        setTimeout(() => setCurrentLocale(locale), 0);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const dropdownHeight = 200;

            setDropdownPosition({
                top: rect.top - dropdownHeight - 8,
                left: rect.left,
            });
        }
    }, [isOpen]);

    const changeLanguage = (code: string) => {
        setIsOpen(false);
        setCurrentLocale(code);
        setTimeout(() => {
            document.cookie = `locale=${code};path=/;max-age=31536000`;
            router.refresh();
        }, 0);
    };

    const currentLang = languages.find(l => l.code === currentLocale) || languages[0];

    const dropdown = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="fixed w-52 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden"
                    style={{
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                        zIndex: 99999,
                    }}
                >
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                changeLanguage(lang.code);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <span className="text-lg">{lang.flag}</span>
                            <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{lang.name}</span>
                            {currentLocale === lang.code && (
                                <Check className="w-4 h-4 text-blue-500" />
                            )}
                        </button>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <button
                ref={buttonRef}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                type="button"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{currentLang.flag}</span>
                <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {mounted && createPortal(dropdown, document.body)}
        </>
    );
}