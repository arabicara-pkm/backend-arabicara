import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Memulai proses seeding...');

    const adminEmail = 'admin@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password123';

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await prisma.user.create({
            data: {
                email: adminEmail,
                username: 'Admin',
                password: hashedPassword,
                role: 'admin',
            },
        });
        console.log(`Akun admin berhasil dibuat dengan email: ${adminEmail}`);
    } else {
        console.log('Akun admin sudah ada.');
    }

    console.log('Proses seeding selesai.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });