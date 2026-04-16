type ActionIconButtonProps = {
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    className: string;
};

export function ActionIconButton({ onClick, title, children, className }: ActionIconButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${className}`}
        >
            {children}
        </button>
    );
}
