"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import { Box } from "@mui/material";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith("/admin");

    if (isAdminRoute) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <Box sx={{ pt: 8 }}>
                {children}
            </Box>
        </>
    );
}

