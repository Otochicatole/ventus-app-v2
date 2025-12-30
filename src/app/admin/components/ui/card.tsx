import styles from "@/shared/styles/ui/card.module.css";

type CardProps = {
    children: React.ReactNode;
    className?: string;
};

export function Card({ children, className = "" }: CardProps) {
    return <div className={`${styles.card} ${className}`}>{children}</div>;
}

export function CardHeader({ children, className = "" }: CardProps) {
    return <div className={`${styles.header} ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: CardProps) {
    return <h3 className={`${styles.title} ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = "" }: CardProps) {
    return <div className={`${styles.content} ${className}`}>{children}</div>;
}

