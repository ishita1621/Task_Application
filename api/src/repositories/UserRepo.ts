import prisma from "../lib/prisma";

type CreateUserData = {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
};

export async function findUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email },
    });
}

export async function createUser(data: CreateUserData) {
    return prisma.user.create({
        data: {
            firstName: data.firstName,
            middleName: data.middleName || null,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
        },
        select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            email: true,
            createdAt: true,
        },
    });
}