"use client";

import Link from "next/link";
import {
    Box,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    Stack,
} from "@mui/material";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function Home() {
    return (
        <Box>
            <Box
                sx={{
                    background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                            "radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 165, 0, 0.1) 0%, transparent 50%)",
                        pointerEvents: "none",
                    },
                }}
            >
                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                    <Grid container spacing={6} alignItems="center">
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Stack spacing={4}>
                                <Box>
                                    <Typography
                                        variant="overline"
                                        sx={{
                                            color: "#FFD700",
                                            fontSize: "1rem",
                                            fontWeight: 600,
                                            letterSpacing: 2,
                                        }}
                                    >
                                        VENTUS BARBERÍA
                                    </Typography>
                                    <Typography
                                        variant="h1"
                                        sx={{
                                            fontWeight: 900,
                                            fontSize: { xs: "3rem", md: "4.5rem" },
                                            lineHeight: 1.1,
                                            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            mb: 2,
                                        }}
                                    >
                                        Tu Estilo,
                                        <br />
                                        Nuestra Pasión
                                    </Typography>
                                </Box>

                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: "#e5e5e5",
                                        fontWeight: 300,
                                        maxWidth: 600,
                                    }}
                                >
                                    Experimentá el arte del barbering moderno. Cortes precisos,
                                    estilo único y atención personalizada.
                                </Typography>

                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                    <Button
                                        component={Link}
                                        href="/shifts"
                                        variant="contained"
                                        size="large"
                                        startIcon={<CalendarMonthIcon />}
                                        sx={{
                                            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                                            color: "#000",
                                            fontSize: "1.1rem",
                                            py: 2,
                                            px: 4,
                                            fontWeight: 700,
                                            "&:hover": {
                                                background: "linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)",
                                                transform: "translateY(-2px)",
                                            },
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        Reservá tu Turno
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        sx={{
                                            borderColor: "#FFD700",
                                            color: "#FFD700",
                                            fontSize: "1.1rem",
                                            py: 2,
                                            px: 4,
                                            fontWeight: 700,
                                            "&:hover": {
                                                borderColor: "#FFA500",
                                                backgroundColor: "rgba(255, 215, 0, 0.1)",
                                            },
                                        }}
                                    >
                                        Ver Servicios
                                    </Button>
                                </Stack>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 5 }}>
                            <Box
                                sx={{
                                    position: "relative",
                                    height: { xs: 300, md: 500 },
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <ContentCutIcon
                                    sx={{
                                        fontSize: { xs: 200, md: 350 },
                                        color: "#FFD700",
                                        opacity: 0.2,
                                        animation: "float 3s ease-in-out infinite",
                                        "@keyframes float": {
                                            "0%, 100%": { transform: "translateY(0px)" },
                                            "50%": { transform: "translateY(-20px)" },
                                        },
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ py: 10, background: "#0a0a0a" }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        textAlign="center"
                        sx={{
                            fontWeight: 900,
                            mb: 2,
                            color: "#FFD700",
                        }}
                    >
                        Nuestros Servicios
                    </Typography>
                    <Typography
                        variant="body1"
                        textAlign="center"
                        sx={{ mb: 6, color: "#a3a3a3", maxWidth: 600, mx: "auto" }}
                    >
                        Cada servicio es una experiencia única diseñada para resaltar tu estilo
                    </Typography>

                    <Grid container spacing={4}>
                        {[
                            {
                                title: "Corte Clásico",
                                description: "Técnicas tradicionales con un toque moderno",
                                price: "$8.000",
                                icon: <ContentCutIcon sx={{ fontSize: 50 }} />,
                            },
                            {
                                title: "Barba & Afeitado",
                                description: "Cuidado premium para tu barba",
                                price: "$6.000",
                                icon: <ContentCutIcon sx={{ fontSize: 50 }} />,
                            },
                            {
                                title: "Peinado & Styling",
                                description: "El acabado perfecto para tu look",
                                price: "$4.000",
                                icon: <ContentCutIcon sx={{ fontSize: 50 }} />,
                            },
                        ].map((service, index) => (
                            <Grid size={{ xs: 12, md: 4 }} key={index}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
                                        border: "1px solid #262626",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-10px)",
                                            borderColor: "#FFD700",
                                            boxShadow: "0 20px 40px rgba(255, 215, 0, 0.2)",
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 4 }}>
                                        <Box
                                            sx={{
                                                color: "#FFD700",
                                                mb: 3,
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {service.icon}
                                        </Box>
                                        <Typography
                                            variant="h5"
                                            textAlign="center"
                                            sx={{ fontWeight: 700, mb: 2, color: "#fff" }}
                                        >
                                            {service.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            textAlign="center"
                                            sx={{ mb: 3, color: "#a3a3a3" }}
                                        >
                                            {service.description}
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            textAlign="center"
                                            sx={{
                                                fontWeight: 900,
                                                color: "#FFD700",
                                            }}
                                        >
                                            {service.price}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ py: 10, background: "#000" }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        textAlign="center"
                        sx={{
                            fontWeight: 900,
                            mb: 2,
                            color: "#FFD700",
                        }}
                    >
                        ¿Por Qué Elegirnos?
                    </Typography>
                    <Typography
                        variant="body1"
                        textAlign="center"
                        sx={{ mb: 6, color: "#a3a3a3", maxWidth: 600, mx: "auto" }}
                    >
                        Más que un corte, una experiencia completa
                    </Typography>

                    <Grid container spacing={4}>
                        {[
                            {
                                icon: <StarIcon />,
                                title: "Barberos Profesionales",
                                description: "Equipo especializado con años de experiencia",
                            },
                            {
                                icon: <AccessTimeIcon />,
                                title: "Sistema de Turnos Online",
                                description: "Reservá cómodamente desde tu celular",
                            },
                            {
                                icon: <PlaceIcon />,
                                title: "Múltiples Ubicaciones",
                                description: "Encontrá la sucursal más cercana",
                            },
                            {
                                icon: <CheckCircleIcon />,
                                title: "Productos Premium",
                                description: "Usamos solo las mejores marcas",
                            },
                        ].map((feature, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                <Box
                                    sx={{
                                        textAlign: "center",
                                        p: 3,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            color: "#FFD700",
                                            fontSize: 60,
                                            mb: 2,
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {feature.icon}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 700, mb: 1, color: "#fff" }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#a3a3a3" }}>
                                        {feature.description}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <Box
                sx={{
                    py: 12,
                    background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                }}
            >
                <Container maxWidth="md">
                    <Stack spacing={4} alignItems="center" textAlign="center">
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 900,
                                color: "#000",
                            }}
                        >
                            ¿Listo para tu Nuevo Look?
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 400,
                                color: "#1a1a1a",
                                maxWidth: 600,
                            }}
                        >
                            Reservá tu turno ahora y descubrí por qué somos la barbería
                            preferida
                        </Typography>
                        <Button
                            component={Link}
                            href="/shifts"
                            variant="contained"
                            size="large"
                            startIcon={<CalendarMonthIcon />}
                            sx={{
                                background: "#000",
                                color: "#FFD700",
                                fontSize: "1.2rem",
                                py: 2.5,
                                px: 5,
                                fontWeight: 700,
                                "&:hover": {
                                    background: "#1a1a1a",
                                    transform: "translateY(-2px)",
                                },
                                transition: "all 0.3s ease",
                            }}
                        >
                            Reservar Turno Ahora
                        </Button>
                    </Stack>
                </Container>
            </Box>

            <Box
                component="footer"
                sx={{
                    py: 6,
                    background: "#0a0a0a",
                    borderTop: "1px solid #262626",
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 900, color: "#FFD700", mb: 2 }}
                            >
                                VENTUS BARBERÍA
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#a3a3a3" }}>
                                Tu estilo, nuestra pasión. Llevamos años perfeccionando el arte
                                del barbering moderno.
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 700, color: "#fff", mb: 2 }}
                            >
                                Horarios
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#a3a3a3", mb: 1 }}>
                                Lunes a Viernes: 9:00 - 20:00
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#a3a3a3", mb: 1 }}>
                                Sábados: 9:00 - 18:00
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#a3a3a3" }}>
                                Domingos: Cerrado
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 700, color: "#fff", mb: 2 }}
                            >
                                Contacto
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#a3a3a3", mb: 1 }}>
                                📞 +54 11 1234-5678
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#a3a3a3", mb: 1 }}>
                                ✉️ info@ventusbarberia.com
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#a3a3a3" }}>
                                📍 Buenos Aires, Argentina
                            </Typography>
                        </Grid>
                    </Grid>
                    <Box
                        sx={{
                            mt: 6,
                            pt: 4,
                            borderTop: "1px solid #262626",
                            textAlign: "center",
                        }}
                    >
                        <Typography variant="body2" sx={{ color: "#737373" }}>
                            © {new Date().getFullYear()} Ventus Barbería. Todos los derechos
                            reservados.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
