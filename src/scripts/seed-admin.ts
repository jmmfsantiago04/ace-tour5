const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const password = 'admin123'; // You should change this password
  const hashedPassword = await hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@acetour.com' },
    update: {},
    create: {
      email: 'admin@acetour.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 