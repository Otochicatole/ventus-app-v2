import { ReactNode } from "react";

interface DialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    maxWidth?: "sm" | "md" | "lg";
    children: ReactNode;
}

export default function Dialog({ open, onClose, title, maxWidth = "md", children }: DialogProps) {
    if (!open) return null;

    const maxWidthClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
                onClick={onClose}
            />
            <div className={`relative bg-neutral-900 border border-neutral-800 rounded-xl w-full ${maxWidthClasses[maxWidth]} shadow-2xl animate-fadeIn`}>
                {title && (
                    <div className="px-8 py-6 border-b border-neutral-800 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}

export function DialogContent({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <div className={`px-8 py-6 ${className}`}>{children}</div>;
}

export function DialogActions({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`px-8 py-6 border-t border-neutral-800 flex justify-end gap-4 ${className}`}>
            {children}
        </div>
    );
}
