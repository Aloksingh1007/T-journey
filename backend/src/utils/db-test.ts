/**
 * Database Connection Test
 * 
 * This file can be used to test the database connection.
 * Run with: npx ts-node src/utils/db-test.ts
 */

import prisma from './prisma';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Try to connect to the database
    await prisma.$connect();
    console.log('✓ Successfully connected to the database');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`✓ Database query successful. Current user count: ${userCount}`);
    
    await prisma.$disconnect();
    console.log('✓ Disconnected from database');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testConnection();
