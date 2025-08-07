import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const username = 'sampleuser';
  const plainPassword = 'samplepass';

  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    console.log('User already seeded. Skipping...');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  console.log('✅ Seeded sampleuser');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
