"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith("/admin");

    if (isAdminRoute) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <div className="pt-16 pb-16 md:pb-0">
                {children}
            </div>
        </>
    );
}
