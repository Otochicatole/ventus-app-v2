import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
    return (
        <div
            className={`bg-white border border-gray-200 rounded-2xl shadow-sm ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = "", ...props }: CardProps) {
    return (
        <div className={`px-8 py-6 border-b border-gray-200 ${className}`} {...props}>
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
        <div className={`px-8 py-6 border-t border-gray-200 flex gap-4 ${className}`} {...props}>
            {children}
        </div>
    );
}
