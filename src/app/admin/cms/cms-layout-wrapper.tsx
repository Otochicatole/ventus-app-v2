"use client";

import { Box } from "@mui/material";
import AdminNavbar from "../components/admin-navbar";
import Sidebar from "../components/sidebar";

type Admin = {
    adminId: string;
    email: string;
    name: string;
};

export default function CMSLayoutWrapper({
    admin,
    children,
}: {
    admin: Admin;
    children: React.ReactNode;
}) {
    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#171717" }}>
            <AdminNavbar admin={admin} />
            <Box sx={{ display: "flex" }}>
                <Sidebar />
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        minHeight: "calc(100vh - 64px)",
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

