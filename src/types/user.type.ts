export type User = {
    id?: number;
    email: string;
    username: string;
    password: string; // Saat mendaftar, password wajib ada
    avatar?: string;
    role?: 'student' | 'admin';
    createdAt?: Date;
    updatedAt?: Date;
};

export interface DecodedUser {
    userId: number;
    email: string;
    role: string;
}


export type UserUpdateData = {
    username?: string;
    avatar?: string;
};