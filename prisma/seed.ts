import { PrismaClient } from "../src/generated/prisma";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Iniciando seed...");

    await prisma.shift.deleteMany();
    await prisma.timeSlot.deleteMany();
    await prisma.unavailableDate.deleteMany();
    await prisma.location.deleteMany();
    await prisma.user.deleteMany();
    await prisma.admin.deleteMany();

    console.log("✅ Datos anteriores eliminados");

    const location1 = await prisma.location.create({
        data: {
            name: "Hospital Central",
            address: "Av. Libertador 1234, CABA",
            latitude: -34.603722,
            longitude: -58.381592,
        },
    });

    const location2 = await prisma.location.create({
        data: {
            name: "Clínica Norte",
            address: "Av. Cabildo 5678, CABA",
            latitude: -34.55891,
            longitude: -58.45727,
        },
    });

    const location3 = await prisma.location.create({
        data: {
            name: "Centro Médico Sur",
            address: "Av. Rivadavia 9012, CABA",
            latitude: -34.61315,
            longitude: -58.37723,
        },
    });

    console.log("✅ Ubicaciones creadas");

    const timeSlots = [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
    ];

    for (const location of [location1, location2, location3]) {
        for (const time of timeSlots) {
            await prisma.timeSlot.create({
                data: {
                    time,
                    locationId: location.id,
                },
            });
        }
    }

    console.log("✅ Horarios creados");

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    await prisma.unavailableDate.create({
        data: {
            date: nextWeek,
            locationId: location1.id,
        },
    });

    console.log("✅ Fechas no disponibles creadas");

    await prisma.shift.create({
        data: {
            name: "Juan",
            lastName: "Pérez",
            email: "juan.perez@example.com",
            phone: "1123456789",
            date: tomorrow,
            time: "10:00",
            confirmed: true,
            notes: "Primera consulta",
            locationId: location1.id,
        },
    });

    await prisma.shift.create({
        data: {
            name: "María",
            lastName: "González",
            email: "maria.gonzalez@example.com",
            phone: "1134567890",
            date: tomorrow,
            time: "11:00",
            confirmed: false,
            locationId: location1.id,
        },
    });

    await prisma.shift.create({
        data: {
            name: "Carlos",
            lastName: "Rodríguez",
            email: "carlos.rodriguez@example.com",
            phone: "1145678901",
            date: tomorrow,
            time: "14:30",
            confirmed: true,
            locationId: location2.id,
        },
    });

    console.log("✅ Turnos creados");

    await prisma.user.create({
        data: {
            email: "admin@ventus.com",
            name: "Administrador",
            password: "hashed_password_here",
        },
    });

    console.log("✅ Usuario admin creado");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await prisma.admin.create({
        data: {
            email: "admin@ventus.com",
            name: "Administrador",
            password: hashedPassword,
        },
    });

    console.log("✅ Admin creado (email: admin@ventus.com, password: admin123)");

    console.log("\n🎉 Seed completado exitosamente!");
    console.log("\n📊 Resumen:");
    console.log(`   - ${await prisma.location.count()} ubicaciones`);
    console.log(`   - ${await prisma.timeSlot.count()} horarios`);
    console.log(`   - ${await prisma.unavailableDate.count()} fechas bloqueadas`);
    console.log(`   - ${await prisma.shift.count()} turnos reservados`);
    console.log(`   - ${await prisma.user.count()} usuarios`);
    console.log(`   - ${await prisma.admin.count()} administradores`);
}

main()
    .catch((e) => {
        console.error("❌ Error en seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

