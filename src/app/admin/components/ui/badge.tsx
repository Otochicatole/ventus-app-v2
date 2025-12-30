import styles from "@/shared/styles/ui/badge.module.css";

type BadgeProps = {
    children: React.ReactNode;
    variant?: "success" | "warning" | "danger" | "info" | "default";
};

export default function Badge({ children, variant = "default" }: BadgeProps) {
    const variantClass = styles[variant] || styles.default;

    return (
        <span className={`${styles.badge} ${variantClass}`}>
            {children}
        </span>
    );
}

