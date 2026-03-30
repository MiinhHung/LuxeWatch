import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const reviews = [
  // Vietnamese
  { rating: 5, comment: "Tuyệt vời, đồng hồ cực kỳ sang trọng, rất đáng tiền. Đóng gói rất kỹ thuật.", userEmail: "minho@example.com" }, // Assuming this user exists or will be created
  { rating: 5, comment: "Giao hàng nhanh, nhân viên tư vấn rất nhiệt tình. Đồng hồ đeo lên tay rất đẳng cấp.", userEmail: "admin@luxetime.com" },
  { rating: 4, comment: "Sản phẩm hoàn thiện tốt, tuy nhiên hộp hơi móp một chút do vận chuyển. Đồng hồ bên trong vẫn hoàn hảo.", userEmail: "user@example.com" },
  
  // English
  { rating: 5, comment: "Absolutely breathtaking craftsmanship. The movement is smooth and the finish is top-notch.", userEmail: "minho@example.com" },
  { rating: 5, comment: "A true masterpiece of horology. Fast shipping and exceptional customer service.", userEmail: "admin@luxetime.com" },
  { rating: 4, comment: "Beautiful design, though the strap was a bit stiff at first. Softened up nicely after a few days.", userEmail: "user@example.com" }
];

async function seed() {
  const products = await prisma.product.findMany();
  if (products.length === 0) {
    console.log("No products found to review. Seed products first.");
    return;
  }

  const users = await prisma.user.findMany();
  if (users.length === 0) {
     console.log("No users found. Creating a test user.");
     // ... could create user here
  }

  for (const product of products) {
    console.log(`Seeding reviews for product: ${product.name}`);
    for (const reviewData of reviews) {
      const user = users.find((u: any) => u.email === reviewData.userEmail) || users[0];
      if (!user) continue;

      // Check if review already exists
      const existing = await prisma.review.findFirst({
        where: { productId: product.id, userId: user.id }
      });

      if (!existing) {
        await prisma.review.create({
          data: {
            rating: reviewData.rating,
            comment: reviewData.comment,
            productId: product.id,
            userId: user.id
          }
        });
      }
    }

    // Recalculate product rating
    const allReviews = await prisma.review.findMany({ where: { productId: product.id } });
    const avgRating = allReviews.length > 0 ? allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length : 0;
    
    await prisma.product.update({
      where: { id: product.id },
      data: {
        rating: avgRating,
        reviewsCount: allReviews.length
      }
    });
  }
}

seed()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
