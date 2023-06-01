import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const password_hash = await argon2.hash('#AdminPassword1');

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@ams.com',
    },
    update: {
      password_hash,
    },
    create: {
      email: 'admin@ams.com',
      name: 'Admin',
      type: 'ADMIN',
      password_hash,
    },
  });

  console.log('Admin user generated:', admin.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
