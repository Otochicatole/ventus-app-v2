import { redirect } from "next/navigation";
import { getAuthCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/jwt";
import { Box, Card, CardContent, Typography, Container } from "@mui/material";
import LoginForm from "../components/login-form";

export default async function LoginPage() {
    const token = await getAuthCookie();

    if (token) {
        const payload = await verifyToken(token);
        if (payload) {
            redirect("/admin/cms");
        }
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
            }}
        >
            <Container maxWidth="sm">
                <Card>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ textAlign: "center", mb: 4 }}>
                            <Typography variant="h3" component="h1" gutterBottom>
                                Ventus Admin
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Ingresá tus credenciales para continuar
                            </Typography>
                        </Box>

                        <LoginForm />

                        <Box sx={{ mt: 3, textAlign: "center" }}>
                            <Typography variant="caption" color="text.secondary">
                                Credenciales de prueba: admin@ventus.com / admin123
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

