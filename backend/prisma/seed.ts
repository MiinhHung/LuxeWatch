import prisma from '../src/utils/prisma';
import 'dotenv/config';

async function main() {
  console.log('Start seeding...');

  // Create Categories
  const catMen = await prisma.category.upsert({
    where: { name: 'Men Watches' },
    update: {},
    create: { name: 'Men Watches', description: 'Luxury watches for men' },
  });

  const catWomen = await prisma.category.upsert({
    where: { name: 'Women Watches' },
    update: {},
    create: { name: 'Women Watches', description: 'Elegant watches for women' },
  });

  // Create Brands
  const brandRolex = await prisma.brand.upsert({
    where: { name: 'Rolex' },
    update: {},
    create: { name: 'Rolex', description: 'Swiss luxury watch manufacturer' },
  });
  
  const brandOmega = await prisma.brand.upsert({
    where: { name: 'Omega' },
    update: {},
    create: { name: 'Omega', description: 'Prestigious Swiss watches' },
  });

  const brandPatek = await prisma.brand.upsert({
    where: { name: 'Patek Philippe' },
    update: {},
    create: { name: 'Patek Philippe', description: 'Genevan luxury watch manufacturer' },
  });

  // Check if products already exist to prevent duplicates
  const existingProducts = await prisma.product.count();
  
  if (existingProducts === 0) {
    // Create Products
    await prisma.product.createMany({
      data: [
        {
          name: 'Daytona Cosmograph',
          description: 'Born to race, the Daytona is the ultimate tool watch for those with a passion for driving and speed.',
          price: 14500.00,
          categoryId: catMen.id,
          brandId: brandRolex.id,
          images: JSON.stringify(['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800']),
          stock: 3,
          rating: 5.0,
          reviewsCount: 24,
        },
        {
          name: 'Speedmaster Moonwatch',
          description: 'The iconic chronograph that was worn on the moon, representing Omega’s adventurous pioneering spirit.',
          price: 6600.00,
          categoryId: catMen.id,
          brandId: brandOmega.id,
          images: JSON.stringify(['https://images.unsplash.com/photo-1614619726201-92591b6e4eac?auto=format&fit=crop&q=80&w=800']),
          stock: 6,
          rating: 4.8,
          reviewsCount: 15,
        },
        {
          name: 'Nautilus 5711',
          description: 'With the rounded octagonal shape of its bezel, the Nautilus has epitomized the elegant sports watch since 1976.',
          price: 35000.00,
          categoryId: catMen.id,
          brandId: brandPatek.id,
          images: JSON.stringify(['https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=800']),
          stock: 1,
          rating: 4.9,
          reviewsCount: 32,
        },
        {
          name: 'Datejust 36',
          description: 'The classic watch of reference. The Datejust is the archetype of the classic watch thanks to functions and aesthetics that never go out of fashion.',
          price: 8550.00,
          categoryId: catWomen.id,
          brandId: brandRolex.id,
          images: JSON.stringify(['https://images.unsplash.com/photo-1587836374828-cb43701df9fd?auto=format&fit=crop&q=80&w=800']),
          stock: 8,
          rating: 4.7,
          reviewsCount: 40,
        }
      ]
    });
    console.log('Products seeded successfully.');
  } else {
    console.log('Products already exist, skipping product seeding.');
  }

  // Create an Admin user
  const adminEmail = 'admin@luxetime.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  
  if (!existingAdmin) {
    // @ts-expect-error Ignore node types
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        fullName: 'Admin User',
        role: 'admin',
      }
    });
    console.log('Admin user (admin@luxetime.com / 123456) seeded successfully.');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    // @ts-expect-error Ignore node types
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
