import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
    return (
        <div
            className={`bg-white border border-stone-200 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = "", ...props }: CardProps) {
    return (
        <div className={`px-5 py-4 sm:px-6 sm:py-5 border-b border-stone-100 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardContent({ children, className = "", ...props }: CardProps) {
    return (
        <div className={`p-4 sm:p-6 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardActions({ children, className = "", ...props }: CardProps) {
    return (
        <div className={`px-5 py-3.5 sm:px-6 sm:py-4 border-t border-stone-100 flex gap-3 ${className}`} {...props}>
            {children}
        </div>
    );
}
