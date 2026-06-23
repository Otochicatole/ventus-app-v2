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

    const hashedPassword = await bcrypt.hash("15651106asd", 10);

    await prisma.admin.create({
        data: {
            email: "ventus122@gmail.com",
            name: "Ventus Admin",
            password: hashedPassword,
        },
    });

    console.log("✅ Admin creado (email: ventus122@gmail.com)");

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

