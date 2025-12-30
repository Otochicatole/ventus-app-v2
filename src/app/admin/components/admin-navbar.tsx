"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppBar, Toolbar, Typography, Box, Button, CircularProgress } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import type { AdminSession } from "@/core/domain/admin.types";

type AdminNavbarProps = {
    admin: AdminSession;
};

export default function AdminNavbar({ admin }: AdminNavbarProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await fetch("/api/admin/logout", {
                method: "POST",
            });
            router.push("/admin/login");
            router.refresh();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backgroundColor: "#262626",
                borderBottom: "1px solid #404040",
            }}
        >
            <Toolbar>
                <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
                    Ventus CMS
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="body2" sx={{ color: "#a3a3a3" }}>
                        {admin.name} ({admin.email})
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLogout}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={16} /> : <LogoutIcon />}
                    >
                        Cerrar Sesión
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

