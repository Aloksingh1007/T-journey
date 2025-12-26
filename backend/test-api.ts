import prisma from './src/utils/prisma';
import * as dashboardService from './src/services/dashboard.service';

async function testAPI() {
  try {
    console.log('Testing dashboard API...');
    
    // Get first user
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ No user found');
      return;
    }
    
    console.log(`Testing with user: ${user.email}`);
    
    // Test currency-specific stats
    console.log('\n📊 Testing getCurrencySpecificStats for INR...');
    const statsINR = await dashboardService.calculateCurrencySpecificStats(
      user.id,
      'INR',
      {}
    );
    console.log('✅ INR Stats:', JSON.stringify(statsINR, null, 2));
    
    console.log('\n📊 Testing getCurrencySpecificStats for USD...');
    const statsUSD = await dashboardService.calculateCurrencySpecificStats(
      user.id,
      'USD',
      {}
    );
    console.log('✅ USD Stats:', JSON.stringify(statsUSD, null, 2));
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ API test error:', error);
    process.exit(1);
  }
}

testAPI();
