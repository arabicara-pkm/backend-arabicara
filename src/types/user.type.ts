export type User = {
    id?: string;
    email: string;
    username: string;
    password: string; // Saat mendaftar, password wajib ada
    avatar?: string;
    role?: 'student' | 'admin';
    createdAt?: Date;
    updatedAt?: Date;
};

export interface DecodedUser {
    userId: string;
    email: string;
    role: string;
}


export type UserUpdateData = {
    username?: string;
    avatar?: string;
};