/**
 * Script to recalculate stats for all users
 * Run this with: npx ts-node recalculate-all-stats.ts
 */

import prisma from './src/utils/prisma';
import { ProfileStatsService } from './src/services/profile-stats.service';

async function recalculateAllStats() {
  try {
    console.log('🔄 Starting stats recalculation for all users...\n');

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    console.log(`Found ${users.length} users\n`);

    // Recalculate stats for each user
    for (const user of users) {
      console.log(`Processing user: ${user.name || user.email} (${user.id})`);
      
      try {
        await ProfileStatsService.updateUserStats(user.id);
        
        // Get updated stats
        const updatedUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            totalTrades: true,
            winRate: true,
            totalPnL: true,
            currentStreak: true,
            longestWinStreak: true,
          },
        });

        console.log(`  ✅ Stats updated:`);
        console.log(`     Total Trades: ${updatedUser?.totalTrades}`);
        console.log(`     Win Rate: ${updatedUser?.winRate}%`);
        console.log(`     Total P&L: $${updatedUser?.totalPnL}`);
        console.log(`     Current Streak: ${updatedUser?.currentStreak}`);
        console.log(`     Longest Win Streak: ${updatedUser?.longestWinStreak}\n`);
      } catch (error: any) {
        console.error(`  ❌ Error updating stats for user ${user.id}:`, error.message);
      }
    }

    console.log('✅ Stats recalculation complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

recalculateAllStats();
