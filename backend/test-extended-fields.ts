import prisma from './src/utils/prisma';
import * as tradeService from './src/services/trade.service';
import { CreateTradeDTO } from './src/validators/trade.validator';

async function testExtendedFields() {
  try {
    console.log('🧪 Testing Extended Trade Fields...\n');
    
    // Get or create a test user
    let user = await prisma.user.findFirst();
    if (!user) {
      console.log('Creating test user...');
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          passwordHash: 'test-hash',
          name: 'Test User',
        },
      });
      console.log('✅ Test user created\n');
    } else {
      console.log(`✅ Using existing user: ${user.email}\n`);
    }
    
    // Create a trade with ALL extended fields
    console.log('📝 Creating trade with all extended fields...');
    const tradeData: CreateTradeDTO = {
      tradeDate: new Date().toISOString(),
      entryTime: '09:30',
      exitTime: '15:45',
      tradeType: 'CRYPTO',
      instrument: 'BTC/USDT',
      tradeDirection: 'BUY_LONG',
      avgBuyPrice: 50000,
      avgSellPrice: 52000,
      positionSize: 0.5,
      leverage: 2,
      baseCurrency: 'USD',
      emotionalState: 'CONFIDENT',
      isImpulsive: false,
      initialNotes: 'Test trade with extended fields',
      
      // Pre-Trade Psychology & Planning
      setupConfidence: 8,
      marketCondition: 'Trending Up',
      timeOfDay: 'Market Open',
      newsImpact: 'Technical Setup',
      strategy: 'Breakout',
      riskRewardRatio: 2.5,
      stopLossPrice: 49000,
      takeProfitPrice: 53000,
      positionSizingReason: 'Risk Management',
      
      // Entry Decision
      entryTrigger: 'Technical Signal',
      hadHesitation: false,
      deviatedFromPlan: false,
      deviationReason: null,
      
      // During Trade
      monitoringFrequency: 'Every Hour',
      stressLevel: 3,
      consideredEarlyExit: false,
      earlyExitReason: null,
      
      // Exit Decision
      exitReason: 'Hit Target',
      exitSatisfaction: 9,
      wouldDoDifferently: 'Nothing, executed perfectly',
      
      // Post-Trade Reflection
      keyLesson: 'Patience pays off',
      mistakesMade: [],
      whatWentWell: 'Entry timing was perfect',
      conditionsMatchExpectation: true,
      
      // Additional Context
      sessionQuality: 9,
      physicalState: 'Well-rested',
      mentalState: 'Focused',
      externalFactors: ['None'],
    };
    
    const createdTrade = await tradeService.createTrade(user.id, tradeData);
    console.log('✅ Trade created successfully');
    console.log(`   Trade ID: ${createdTrade.id}`);
    console.log(`   P&L: $${createdTrade.pnl.toString()}\n`);
    
    // Verify all extended fields were saved
    console.log('🔍 Verifying extended fields were saved...');
    const retrievedTrade = await tradeService.getTradeById(user.id, createdTrade.id);
    
    if (!retrievedTrade) {
      throw new Error('Trade not found after creation');
    }
    
    const fieldsToCheck = [
      { name: 'setupConfidence', value: retrievedTrade.setupConfidence },
      { name: 'marketCondition', value: retrievedTrade.marketCondition },
      { name: 'timeOfDay', value: retrievedTrade.timeOfDay },
      { name: 'newsImpact', value: retrievedTrade.newsImpact },
      { name: 'strategy', value: retrievedTrade.strategy },
      { name: 'riskRewardRatio', value: retrievedTrade.riskRewardRatio?.toString() },
      { name: 'stopLossPrice', value: retrievedTrade.stopLossPrice?.toString() },
      { name: 'takeProfitPrice', value: retrievedTrade.takeProfitPrice?.toString() },
      { name: 'positionSizingReason', value: retrievedTrade.positionSizingReason },
      { name: 'entryTrigger', value: retrievedTrade.entryTrigger },
      { name: 'hadHesitation', value: retrievedTrade.hadHesitation },
      { name: 'deviatedFromPlan', value: retrievedTrade.deviatedFromPlan },
      { name: 'monitoringFrequency', value: retrievedTrade.monitoringFrequency },
      { name: 'stressLevel', value: retrievedTrade.stressLevel },
      { name: 'consideredEarlyExit', value: retrievedTrade.consideredEarlyExit },
      { name: 'exitReason', value: retrievedTrade.exitReason },
      { name: 'exitSatisfaction', value: retrievedTrade.exitSatisfaction },
      { name: 'wouldDoDifferently', value: retrievedTrade.wouldDoDifferently },
      { name: 'keyLesson', value: retrievedTrade.keyLesson },
      { name: 'mistakesMade', value: retrievedTrade.mistakesMade },
      { name: 'whatWentWell', value: retrievedTrade.whatWentWell },
      { name: 'conditionsMatchExpectation', value: retrievedTrade.conditionsMatchExpectation },
      { name: 'sessionQuality', value: retrievedTrade.sessionQuality },
      { name: 'physicalState', value: retrievedTrade.physicalState },
      { name: 'mentalState', value: retrievedTrade.mentalState },
      { name: 'externalFactors', value: retrievedTrade.externalFactors },
    ];
    
    let allFieldsValid = true;
    for (const field of fieldsToCheck) {
      if (field.value !== null && field.value !== undefined) {
        console.log(`   ✅ ${field.name}: ${JSON.stringify(field.value)}`);
      } else {
        console.log(`   ⚠️  ${field.name}: null/undefined`);
        allFieldsValid = false;
      }
    }
    
    if (allFieldsValid) {
      console.log('\n✅ All extended fields saved correctly!\n');
    } else {
      console.log('\n⚠️  Some fields were not saved\n');
    }
    
    // Test updating extended fields
    console.log('📝 Testing update of extended fields...');
    const updatedTrade = await tradeService.updateTrade(user.id, createdTrade.id, {
      setupConfidence: 10,
      strategy: 'Momentum',
      stressLevel: 2,
      exitSatisfaction: 10,
      keyLesson: 'Updated lesson: Always follow the plan',
      mistakesMade: ['Checked charts too frequently'],
      externalFactors: ['Work Stress', 'None'],
    });
    
    if (!updatedTrade) {
      throw new Error('Failed to update trade');
    }
    
    console.log('✅ Trade updated successfully');
    console.log(`   Updated setupConfidence: ${updatedTrade.setupConfidence}`);
    console.log(`   Updated strategy: ${updatedTrade.strategy}`);
    console.log(`   Updated stressLevel: ${updatedTrade.stressLevel}`);
    console.log(`   Updated exitSatisfaction: ${updatedTrade.exitSatisfaction}`);
    console.log(`   Updated keyLesson: ${updatedTrade.keyLesson}`);
    console.log(`   Updated mistakesMade: ${JSON.stringify(updatedTrade.mistakesMade)}`);
    console.log(`   Updated externalFactors: ${JSON.stringify(updatedTrade.externalFactors)}\n`);
    
    // Verify updates persisted
    const verifyUpdated = await tradeService.getTradeById(user.id, createdTrade.id);
    if (verifyUpdated) {
      const updatesCorrect = 
        verifyUpdated.setupConfidence === 10 &&
        verifyUpdated.strategy === 'Momentum' &&
        verifyUpdated.stressLevel === 2 &&
        verifyUpdated.exitSatisfaction === 10 &&
        verifyUpdated.keyLesson === 'Updated lesson: Always follow the plan' &&
        verifyUpdated.mistakesMade?.length === 1 &&
        verifyUpdated.externalFactors?.length === 2;
      
      if (updatesCorrect) {
        console.log('✅ All updates persisted correctly!\n');
      } else {
        console.log('⚠️  Some updates did not persist correctly\n');
      }
    }
    
    // Clean up test trade
    console.log('🧹 Cleaning up test trade...');
    await tradeService.deleteTrade(user.id, createdTrade.id);
    console.log('✅ Test trade deleted\n');
    
    console.log('🎉 All extended field tests passed!\n');
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Test failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testExtendedFields();
