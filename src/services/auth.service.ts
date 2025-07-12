import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../types/user.type';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

export const registerUser = async (userData: User) => {
    const existingUser = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existingUser) throw new Error('Email sudah terdaftar.');

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
        data: { ...userData, password: hashedPassword },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export const loginUser = async (credentials: Pick<User, 'email' | 'password'>) => {
    const user = await prisma.user.findUnique({ where: { email: credentials.email } });
    if (!user || !user.password) throw new Error('Email atau password salah.');

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) throw new Error('Email atau password salah.');

    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};