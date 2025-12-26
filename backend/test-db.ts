import prisma from './src/utils/prisma';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`📊 Total users: ${userCount}`);
    
    // Get first user
    const firstUser = await prisma.user.findFirst();
    if (firstUser) {
      console.log(`👤 First user: ${firstUser.email} (ID: ${firstUser.id})`);
      
      // Count trades for this user
      const tradeCount = await prisma.trade.count({
        where: { userId: firstUser.id }
      });
      console.log(`📈 Trades for this user: ${tradeCount}`);
    } else {
      console.log('⚠️  No users found in database');
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Database error:', error);
    process.exit(1);
  }
}

testDatabase();
