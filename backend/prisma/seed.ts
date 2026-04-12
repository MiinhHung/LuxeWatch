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
    // Import bcrypt
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

  // Create WELCOME Coupon
  await prisma.coupon.upsert({
    where: { code: 'WELCOME' },
    update: {},
    create: {
      code: 'WELCOME',
      discountAmount: 500.00,
      isActive: true,
    }
  });
  console.log('Coupon WELCOME seeded successfully.');

  // Create Blog Posts
  const blogPosts = [
    {
      title: "The Crown's Legacy: A History of Rolex",
      slug: "history-of-rolex",
      excerpt: "From the first waterproof watch to the exploration of the deepest oceans, discover why Rolex remains the world's most recognized luxury brand.",
      content: "Rolex was founded in 1905 by Hans Wilsdorf and Alfred Davis. Wilsdorf's vision was to create wristwatches that were not only elegant but also reliably accurate. In 1926, the 'Oyster' was introduced as the world's first waterproof wristwatch. Since then, Rolex has accompanied explorers to the top of Everest and the bottom of the Mariana Trench. Today, it stands as the pinnacle of horological achievement and social status. Owning a Rolex is not just about keeping time; it is about owning a piece of human history.",
      image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1200",
      category: "Heritage",
    },
    {
      title: "To the Moon and Back: The Omega Speedmaster Story",
      slug: "omega-speedmaster-story",
      excerpt: "Explore the legendary chronograph that was flight-qualified by NASA for all manned space missions and became the first watch on the moon.",
      content: "Few watches in the world have the heritage of the Omega Speedmaster. Introduced in 1957 as a racing and sports chronograph, it was selected by NASA in 1965 after rigorous testing. Buzz Aldrin wore his Speedmaster Professional on the lunar surface during the Apollo 11 mission in 1969. Its robustness and classic aesthetic have made it a favorite among collectors for decades. The 'Moonwatch' continues to be manufactured today, closely following the original technical specifications.",
      image: "https://images.unsplash.com/photo-1623991985630-7264426f827f?auto=format&fit=crop&q=80&w=1200",
      category: "Heritage",
    },
    {
      title: "Patek Philippe: Generations of Perfection",
      slug: "patek-philippe-perfection",
      excerpt: "You never actually own a Patek Philippe. You merely look after it for the next generation. Discover the philosophy behind the world's finest watches.",
      content: "Since 1839, Patek Philippe has been at the forefront of the Genevan watchmaking tradition. As the last family-owned independent watch manufacturer in Geneva, they have full creative freedom to design, produce, and assemble what experts agree to be the finest timepieces in the world. Their commitment to innovation and craftsmanship has resulted in more than 100 patents. A Patek Philippe is often considered an investment, a family heirloom that gains value and history as it is passed down.",
      image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=1200",
      category: "Heritage",
    },
    {
      title: "The Art of Horological Care: Maintaining Your Timepiece",
      slug: "watch-maintenance-guide",
      excerpt: "A luxury watch is a mechanical masterpiece. Learn the essential tips for cleaning, storage, and servicing to ensure your watch lasts for generations.",
      content: "Mechanical watches require regular maintenance to perform optimally. We recommend a full service every 5 to 7 years, depending on the model and usage. For daily care, ensure the crown is screwed down before any contact with water, and rinse your watch with fresh water after swimming in the ocean. Avoid magnetic fields and extreme temperature changes. Store your watches in a dry, cool place, preferably in a dedicated watch winder if they are automatic. Proper care is the secret to a lifetime of precision.",
      image: "https://images.unsplash.com/photo-1662995574041-925708899859?auto=format&fit=crop&q=80&w=1200",
      category: "Maintenance",
    },
    {
      title: "2026 Trends: The Return of Smaller Case Sizes",
      slug: "2026-watch-trends",
      excerpt: "The era of oversized watches is fading. Discover why 36mm and 39mm are becoming the new standard for modern luxury and elegance.",
      content: "The trend cycles in horology are shifting back toward classic proportions. In 2026, we are seeing a significant move away from 44mm+ cases. Brands like Rolex and Patek are leading the way with a revitalization of 36mm models, proving that elegance and presence are not determined by size. Thinner movements and integrated bracelets are also dominating the landscape, offering a 'quiet luxury' aesthetic that focuses on texture and craftsmanship rather than bulk.",
      image: "https://images.unsplash.com/photo-1434056886845-dac89faf9b5d?auto=format&fit=crop&q=80&w=1200",
      category: "Trends",
    }
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log('Blog posts seeded successfully.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    // Exit process
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
