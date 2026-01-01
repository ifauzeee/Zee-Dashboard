
import { motion } from 'framer-motion';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
}

export const Switch = ({ checked, onChange, label, description }: SwitchProps) => (
    <div className="flex items-center justify-between py-3">
        <div className="flex-1 pr-4">
            {label && <div className="text-sm font-medium text-gray-900 dark:text-white">{label}</div>}
            {description && <div className="text-xs text-gray-600 dark:text-gray-500 mt-0.5">{description}</div>}
        </div>
        <button
            onClick={() => onChange(!checked)}
            className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white/10'
                }`}
        >
            <motion.div
                initial={false}
                animate={{
                    x: checked ? 22 : 2
                }}
                className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
            />
        </button>
    </div>
);
