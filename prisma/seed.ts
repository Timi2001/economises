import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = await bcrypt.hash('password', 10); // Default password is 'password'

  const user = await prisma.user.upsert({
    where: { username },
    update: {},
    create: {
      username,
      password,
    },
  });

  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
