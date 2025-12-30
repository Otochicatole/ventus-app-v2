import { HTMLAttributes } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
    severity?: "success" | "error" | "warning" | "info";
    children: React.ReactNode;
}

export default function Alert({ severity = "info", children, className = "", ...props }: AlertProps) {
    const styles = {
        success: "bg-green-50 border-green-200 text-green-700",
        error: "bg-red-50 border-red-200 text-red-700",
        warning: "bg-amber-50 border-amber-200 text-amber-700",
        info: "bg-blue-50 border-blue-200 text-blue-700",
    };

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-green-600" />,
        error: <XCircle className="w-5 h-5 text-red-600" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-600" />,
        info: <Info className="w-5 h-5 text-blue-600" />,
    };

    return (
        <div
            className={`flex items-start gap-3 px-4 py-3 border-2 rounded-xl ${styles[severity]} ${className}`}
            role="alert"
            {...props}
        >
            <div className="shrink-0 mt-0.5">{icons[severity]}</div>
            <div className="flex-1 font-medium">{children}</div>
        </div>
    );
}
