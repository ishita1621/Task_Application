import { PrismaClient } from "../src/generated/client"
import { PrismaPg } from "@prisma/adapter-pg";

const adapter=new PrismaPg({
    connectionString:process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({adapter});

async function main() {
    const adminRole = await prisma.role.upsert({
        where: { name: "ADMIN" },
        update: {},
        create: { name: "ADMIN" },
    });

    const managerRole = await prisma.role.upsert({
        where: { name: "MANAGER" },
        update: {},
        create: { name: "MANAGER" },
    });

    const userRole = await prisma.role.upsert({
        where: { name: "USER" },
        update: {},
        create: { name: "USER" },
    });

    const permissionNames = [
        "TASK_CREATE",
        "TASK_READ",
        "TASK_UPDATE",
        "TASK_DELETE",
        "USER_MANAGE",
    ];

    const permissions = []; //database record returned by Prisma.

    for (const name of permissionNames) {
        const permission = await prisma.permission.upsert({
            where: { name },
            update: {},
            create: { name },
        });

        permissions.push(permission);
    }

    const rolePermissions = [
        {
            roleId: adminRole.id,
            permissionIds: permissions.map((permission) => permission.id),
        },
        {
            roleId: managerRole.id,
            permissionIds: permissions
                .filter((permission) => permission.name !== "USER_MANAGE")
                .map((permission) => permission.id),
        },
        {
            roleId: userRole.id,
            permissionIds: permissions
                .filter((permission) =>
                    ["TASK_CREATE", "TASK_READ", "TASK_UPDATE", "TASK_DELETE"]
                        .includes(permission.name)
                )
                .map((permission) => permission.id),
        },
    ];

    for (const rolePermission of rolePermissions) {
        for (const permissionId of rolePermission.permissionIds) {
            await prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: rolePermission.roleId,
                        permissionId,
                    },
                },
                update: {},
                create: {
                    roleId: rolePermission.roleId,
                    permissionId,
                },
            });
        }
    }


    console.log("Roles and permissions seeded successfully!");
}

main()
    .catch((error) => {
        console.error("Error while seeding:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
