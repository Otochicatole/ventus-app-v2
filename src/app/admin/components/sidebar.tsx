"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BlockIcon from "@mui/icons-material/Block";

const menuItems = [
    {
        label: "Dashboard",
        href: "/admin/cms",
        icon: <DashboardIcon />,
    },
    {
        label: "Turnos",
        href: "/admin/cms/shifts",
        icon: <EventIcon />,
    },
    {
        label: "Ubicaciones",
        href: "/admin/cms/locations",
        icon: <LocationOnIcon />,
    },
    {
        label: "Horarios",
        href: "/admin/cms/time-slots",
        icon: <AccessTimeIcon />,
    },
    {
        label: "Fechas Bloqueadas",
        href: "/admin/cms/blocked-dates",
        icon: <BlockIcon />,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <Box
            sx={{
                width: 250,
                backgroundColor: "#171717",
                borderRight: "1px solid #404040",
                height: "calc(100vh - 64px)",
                position: "sticky",
                top: 64,
            }}
        >
            <List sx={{ pt: 3, px: 1.5 }}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                component={Link}
                                href={item.href}
                                selected={isActive}
                                sx={{
                                    borderRadius: "6px",
                                    "&.Mui-selected": {
                                        backgroundColor: "#1567ff",
                                        color: "#ffffff",
                                        "&:hover": {
                                            backgroundColor: "#0548cc",
                                        },
                                        "& .MuiListItemIcon-root": {
                                            color: "#ffffff",
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: isActive ? "#ffffff" : "#a3a3a3", minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}

