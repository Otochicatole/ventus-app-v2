import { HTMLAttributes } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
    severity?: "success" | "error" | "warning" | "info";
    children: React.ReactNode;
}

export default function Alert({ severity = "info", children, className = "", ...props }: AlertProps) {
    const styles = {
        success: "bg-emerald-50 border-emerald-200 text-emerald-900",
        error: "bg-red-50 border-red-200 text-red-900",
        warning: "bg-amber-50 border-amber-200 text-amber-900",
        info: "bg-[#0b3a60]/5 border-[#0b3a60]/20 text-[#0b3a60]",
    };

    const icons = {
        success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
        error: <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />,
        warning: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
        info: <Info className="w-4 h-4 text-[#0b3a60] shrink-0 mt-0.5" />,
    };

    return (
        <div
            className={`flex items-start gap-2.5 px-4 py-3 border rounded-xl text-sm ${styles[severity]} ${className}`}
            role="alert"
            {...props}
        >
            {icons[severity]}
            <div className="flex-1 font-medium">{children}</div>
        </div>
    );
}
