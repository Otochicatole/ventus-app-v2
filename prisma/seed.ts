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
    await prisma.service.deleteMany();

    console.log("✅ Datos anteriores eliminados");

    const location1 = await prisma.location.create({
        data: {
            name: "Ventus Palermo",
            address: "Av. Santa Fe 3456, Palermo",
            latitude: -34.588433,
            longitude: -58.413827,
        },
    });

    const location2 = await prisma.location.create({
        data: {
            name: "Ventus Belgrano",
            address: "Av. Cabildo 2100, Belgrano",
            latitude: -34.55891,
            longitude: -58.45727,
        },
    });

    const location3 = await prisma.location.create({
        data: {
            name: "Ventus Centro",
            address: "Florida 650, Microcentro",
            latitude: -34.59839,
            longitude: -58.37451,
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
    today.setHours(12, 0, 0, 0);
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
            notes: "Corte y barba",
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
            name: "Laura",
            lastName: "Fernández",
            email: "laura.fernandez@example.com",
            phone: "1145678902",
            date: tomorrow,
            time: "11:00",
            confirmed: false,
            locationId: location1.id,
        },
    });

    await prisma.shift.create({
        data: {
            name: "Sofía",
            lastName: "López",
            email: "sofia.lopez@example.com",
            phone: "1156789013",
            date: tomorrow,
            time: "14:00",
            confirmed: false,
            locationId: location1.id,
        },
    });

    await prisma.shift.create({
        data: {
            name: "Valentina",
            lastName: "Díaz",
            email: "valentina.diaz@example.com",
            phone: "1167890124",
            date: tomorrow,
            time: "14:00",
            confirmed: false,
            locationId: location1.id,
        },
    });

    await prisma.shift.create({
        data: {
            name: "Camila",
            lastName: "Ruiz",
            email: "camila.ruiz@example.com",
            phone: "1178901235",
            date: tomorrow,
            time: "14:00",
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

    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    dayAfterTomorrow.setHours(12, 0, 0, 0);

    await prisma.shift.create({
        data: {
            name: "Pedro",
            lastName: "Martinez",
            email: "pedro.martinez@example.com",
            phone: "1156789012",
            date: dayAfterTomorrow,
            time: "09:30",
            confirmed: true,
            locationId: location3.id,
        },
    });

    await prisma.shift.create({
        data: {
            name: "Ana",
            lastName: "Lopez",
            email: "ana.lopez@example.com",
            phone: "1167890123",
            date: dayAfterTomorrow,
            time: "15:00",
            confirmed: false,
            locationId: location1.id,
        },
    });

    console.log("✅ Turnos creados");

    await prisma.service.create({
        data: {
            name: "Corte de Pelo",
            description: "Corte de pelo clásico o moderno según tu estilo",
            price: 5000,
            duration: 30,
            active: true,
        },
    });

    await prisma.service.create({
        data: {
            name: "Corte de Barba",
            description: "Recorte y perfilado de barba",
            price: 3000,
            duration: 20,
            active: true,
        },
    });

    await prisma.service.create({
        data: {
            name: "Corte + Barba",
            description: "Combo de corte de pelo y barba",
            price: 7000,
            duration: 45,
            active: true,
        },
    });

    await prisma.service.create({
        data: {
            name: "Afeitado Completo",
            description: "Afeitado tradicional con toalla caliente",
            price: 4000,
            duration: 25,
            active: true,
        },
    });

    await prisma.service.create({
        data: {
            name: "Tintura",
            description: "Coloración y tintura de cabello",
            price: 6000,
            duration: 60,
            active: true,
        },
    });

    console.log("✅ Servicios creados");

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
    console.log(`   - ${await prisma.service.count()} servicios`);
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

