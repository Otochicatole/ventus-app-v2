import { ButtonHTMLAttributes, forwardRef } from "react";
import styles from "../../styles/buttons/button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    isLoading?: boolean;
    fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            isLoading = false,
            fullWidth = false,
            disabled,
            className,
            ...props
        },
        ref
    ) => {
        const buttonClasses = [
            styles.button,
            fullWidth && styles.fullWidth,
            isLoading && styles.loading,
            className,
        ]
            .filter(Boolean)
            .join(" ");

        return (
            <button
                ref={ref}
                className={buttonClasses}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <span className={styles.loadingContent}>
                        <span className={styles.spinner} />
                        {children}
                    </span>
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;