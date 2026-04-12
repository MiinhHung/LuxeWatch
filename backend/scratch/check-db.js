const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const productCount = await prisma.product.count();
  const blogCount = await prisma.blogPost.count();
  const blogs = await prisma.blogPost.findMany();
  console.log('Product count:', productCount);
  console.log('Blog count:', blogCount);
  console.log('Blogs:', JSON.stringify(blogs, null, 2));
  process.exit(0);
}

check();
