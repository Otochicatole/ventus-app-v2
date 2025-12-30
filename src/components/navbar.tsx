"use client";

import { useState } from "react";
import Link from "next/link";
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Button,
    MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const pages = [
    { name: "Inicio", href: "/" },
    { name: "Servicios", href: "/#servicios" },
    { name: "Nosotros", href: "/#nosotros" },
];

export default function Navbar() {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                background: "rgba(10, 10, 10, 0.95)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
                borderBottom: "1px solid rgba(255, 215, 0, 0.1)",
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <ContentCutIcon
                        sx={{
                            display: { xs: "none", md: "flex" },
                            mr: 1,
                            color: "#FFD700",
                            fontSize: 32,
                        }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontWeight: 900,
                            fontSize: "1.5rem",
                            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            textDecoration: "none",
                        }}
                    >
                        VENTUS
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            sx={{ color: "#FFD700" }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem
                                    key={page.name}
                                    onClick={handleCloseNavMenu}
                                    component={Link}
                                    href={page.href}
                                >
                                    <Typography textAlign="center">{page.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <ContentCutIcon
                        sx={{
                            display: { xs: "flex", md: "none" },
                            mr: 1,
                            color: "#FFD700",
                        }}
                    />
                    <Typography
                        variant="h5"
                        noWrap
                        component={Link}
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                            fontWeight: 900,
                            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            textDecoration: "none",
                        }}
                    >
                        VENTUS
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 4 }}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                component={Link}
                                href={page.href}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,
                                    color: "#fff",
                                    display: "block",
                                    fontWeight: 600,
                                    mx: 1,
                                    "&:hover": {
                                        color: "#FFD700",
                                    },
                                }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Button
                            component={Link}
                            href="/shifts"
                            variant="contained"
                            startIcon={<CalendarMonthIcon />}
                            sx={{
                                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                                color: "#000",
                                fontWeight: 700,
                                px: 3,
                                "&:hover": {
                                    background: "linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)",
                                },
                            }}
                        >
                            Reservar
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

