const { PrismaClient } = require('@prisma/client/extension');
const prismaClient = new PrismaClient();
module.exports = { prismaClient };
