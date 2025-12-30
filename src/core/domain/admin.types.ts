export type Admin = {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
};

export type AdminSession = {
    adminId: string;
    email: string;
    name: string;
};

