import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
    return (
        <div
            className={`bg-neutral-900/80 border border-neutral-800 rounded-xl shadow-xl ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = "", ...props }: CardProps) {
    return (
        <div className={`px-8 py-6 border-b border-neutral-800 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardContent({ children, className = "", ...props }: CardProps) {
    return (
        <div className={`px-8 py-6 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardActions({ children, className = "", ...props }: CardProps) {
    return (
        <div className={`px-8 py-6 border-t border-neutral-800 flex gap-4 ${className}`} {...props}>
            {children}
        </div>
    );
}
