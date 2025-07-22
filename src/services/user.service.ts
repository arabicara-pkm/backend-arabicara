import { PrismaClient } from '@prisma/client';
import { UserUpdateData } from '../types/user.type';

const prisma = new PrismaClient();

// Fungsi untuk update user
export const updateUserById = async (userId: string, data: UserUpdateData) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data: data,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

// Fungsi untuk delete user
export const deleteUserById = async (userId: string) => {
    await prisma.user.delete({
        where: { id: userId },
    });
};