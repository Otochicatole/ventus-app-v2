import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Box, Typography, Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CMSDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
        totalLocations,
        totalShifts,
        confirmedShifts,
        pendingShifts,
        todayShifts,
        recentShifts,
    ] = await Promise.all([
        prisma.location.count(),
        prisma.shift.count(),
        prisma.shift.count({ where: { confirmed: true } }),
        prisma.shift.count({ where: { confirmed: false } }),
        prisma.shift.count({
            where: {
                date: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        }),
        prisma.shift.findMany({
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
                location: true,
            },
        }),
    ]);

    return (
        <Box sx={{ maxWidth: 1400, mx: "auto", px: 3, py: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Dashboard
                </Typography>
                <Link href="/admin/cms/shifts/new" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                    >
                        Nuevo Turno
                    </Button>
                </Link>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" }, gap: 3, mb: 4 }}>
                <Card>
                    <CardContent>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Total Turnos
                        </Typography>
                        <Typography variant="h3" component="p">
                            {totalShifts}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                            Todos los turnos registrados
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Confirmados
                        </Typography>
                        <Typography variant="h3" component="p" color="success.light">
                            {confirmedShifts}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                            Turnos confirmados
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Pendientes
                        </Typography>
                        <Typography variant="h3" component="p" color="warning.light">
                            {pendingShifts}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                            Por confirmar
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Turnos Hoy
                        </Typography>
                        <Typography variant="h3" component="p" color="info.light">
                            {todayShifts}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                            Programados para hoy
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            <Card>
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6" component="h2">
                            Últimos Turnos Reservados
                        </Typography>
                        <Link href="/admin/cms/shifts" style={{ textDecoration: "none" }}>
                            <Button
                                size="small"
                                color="primary"
                            >
                                Ver todos →
                            </Button>
                        </Link>
                    </Box>

                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Paciente</TableCell>
                                    <TableCell>Ubicación</TableCell>
                                    <TableCell>Fecha y Hora</TableCell>
                                    <TableCell>Estado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentShifts.map((shift) => (
                                    <TableRow key={shift.id} hover>
                                        <TableCell>
                                            {shift.name} {shift.lastName}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{shift.location.name}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {(() => {
                                                    const dateStr = shift.date.toISOString().split("T")[0];
                                                    const [year, month, day] = dateStr.split("-");
                                                    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                                    return date.toLocaleDateString("es-AR");
                                                })()} - {shift.time}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={shift.confirmed ? "Confirmado" : "Pendiente"}
                                                color={shift.confirmed ? "success" : "warning"}
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
}

