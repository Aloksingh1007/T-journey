/**
 * Quick test script to verify analytics is working
 * Run with: npx ts-node src/test-analytics.ts
 */

import { analyticsService } from './services/analytics.service';
import prisma from './utils/prisma';

async function testAnalytics() {
  console.log('🧪 Testing Analytics System...\n');

  const testUserId = 'test-user-' + Date.now();

  try {
    // Test 1: Track Event
    console.log('1️⃣ Testing event tracking...');
    await analyticsService.trackEvent(
      testUserId,
      'test_event',
      { message: 'Hello from test!' }
    );
    console.log('✅ Event tracked successfully\n');

    // Test 2: Store Insight
    console.log('2️⃣ Testing insight storage...');
    const insightId = await analyticsService.storeInsight(
      testUserId,
      'test_insight',
      { insight: 'This is a test insight' },
      { confidence: 0.95 }
    );
    console.log(`✅ Insight stored with ID: ${insightId}\n`);

    // Test 3: Record Pattern
    console.log('3️⃣ Testing pattern recording...');
    await analyticsService.recordPattern(
      testUserId,
      'test-trade-id',
      'test_pattern',
      0.8,
      'win',
      100,
      'CONFIDENT'
    );
    console.log('✅ Pattern recorded successfully\n');

    // Test 4: Start Session
    console.log('4️⃣ Testing session tracking...');
    const sessionId = await analyticsService.startSession(testUserId, 'desktop');
    console.log(`✅ Session started with ID: ${sessionId}\n`);

    // Test 5: Get User Insights
    console.log('5️⃣ Testing insight retrieval...');
    const insights = await analyticsService.getUserInsights(testUserId);
    console.log(`✅ Retrieved ${insights.length} insight(s)\n`);

    // Test 6: Get User Patterns
    console.log('6️⃣ Testing pattern retrieval...');
    const patterns = await analyticsService.getUserPatterns(testUserId);
    console.log(`✅ Retrieved ${patterns.length} pattern(s)\n`);

    // Test 7: Record Feedback
    console.log('7️⃣ Testing insight feedback...');
    await analyticsService.recordInsightFeedback(
      insightId,
      true,
      'Very helpful!',
      'changed_behavior'
    );
    console.log('✅ Feedback recorded successfully\n');

    // Test 8: Submit User Feedback
    console.log('8️⃣ Testing user feedback submission...');
    await analyticsService.submitFeedback(
      testUserId,
      'feature_request',
      'This is a test feedback',
      { rating: 5 }
    );
    console.log('✅ User feedback submitted successfully\n');

    // Test 9: End Session
    console.log('9️⃣ Testing session end...');
    await analyticsService.endSession(sessionId);
    console.log('✅ Session ended successfully\n');

    // Verify data in database
    console.log('🔍 Verifying data in database...');
    const [events, insightsCount, patternsCount, sessions, feedback] = await Promise.all([
      prisma.analyticsEvent.count({ where: { userId: testUserId } }),
      prisma.aIInsight.count({ where: { userId: testUserId } }),
      prisma.patternOccurrence.count({ where: { userId: testUserId } }),
      prisma.userSession.count({ where: { userId: testUserId } }),
      prisma.userFeedback.count({ where: { userId: testUserId } }),
    ]);

    console.log(`\n📊 Database Verification:`);
    console.log(`   Events: ${events}`);
    console.log(`   Insights: ${insightsCount}`);
    console.log(`   Patterns: ${patternsCount}`);
    console.log(`   Sessions: ${sessions}`);
    console.log(`   Feedback: ${feedback}`);

    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...');
    await Promise.all([
      prisma.analyticsEvent.deleteMany({ where: { userId: testUserId } }),
      prisma.aIInsight.deleteMany({ where: { userId: testUserId } }),
      prisma.patternOccurrence.deleteMany({ where: { userId: testUserId } }),
      prisma.userSession.deleteMany({ where: { userId: testUserId } }),
      prisma.userFeedback.deleteMany({ where: { userId: testUserId } }),
    ]);
    console.log('✅ Test data cleaned up\n');

    console.log('🎉 All tests passed! Analytics system is working correctly.\n');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testAnalytics();
