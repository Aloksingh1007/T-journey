import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testRecalculateStats() {
  try {
    // First, login to get a token
    console.log('Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com', // Replace with your test user email
      password: 'password123', // Replace with your test user password
    });

    const token = loginResponse.data.token;
    const userId = loginResponse.data.user.id;
    console.log('Logged in successfully!');
    console.log('User ID:', userId);

    // Recalculate stats
    console.log('\nRecalculating profile statistics...');
    const recalcResponse = await axios.post(
      `${API_URL}/profile/recalculate-stats`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Stats recalculated:', recalcResponse.data);

    // Get updated profile
    console.log('\nFetching updated profile...');
    const profileResponse = await axios.get(`${API_URL}/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const profile = profileResponse.data.data;
    console.log('\nUpdated Profile Stats:');
    console.log('- Total Trades:', profile.stats.totalTrades);
    console.log('- Win Rate:', profile.stats.winRate.toFixed(2) + '%');
    console.log('- Total P&L:', profile.stats.totalPnL);
    console.log('- Current Streak:', profile.stats.currentStreak);
    console.log('- Longest Win Streak:', profile.stats.longestWinStreak);
    console.log('- Best Trade Date:', profile.stats.bestTradeDate);
    console.log('- Badges:', profile.badges.length);

  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testRecalculateStats();
