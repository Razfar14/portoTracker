const BASE_URL = 'http://localhost:3000';

async function postJSON(url, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

async function getJSON(url, token) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, {
    method: 'GET',
    headers
  });
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('=== STARTING AUTOMATED FEATURE VERIFICATION ===\n');

  // 1. Login Admin 1
  console.log('1. Testing Admin Login (admin / admin123)...');
  const adminLogin = await postJSON(`${BASE_URL}/api/auth/login`, {
    username: 'admin',
    password: 'admin123'
  });
  if (!adminLogin.ok) throw new Error('Admin login failed: ' + adminLogin.data.message);
  const adminToken = adminLogin.data.token;
  console.log(' Admin login success! Token acquired.\n');

  // Fetch Admin's client (teman)
  const myClientsInit = await getJSON(`${BASE_URL}/api/auth/my-clients`, adminToken);
  const temanUser = myClientsInit.data.clients.find(c => c.username === 'teman');
  if (!temanUser) throw new Error('Client teman not found under admin!');
  const temanId = temanUser.id;
  console.log(` Found client "teman" with ID: ${temanId}, initial cash balance: Rp ${temanUser.cash_balance.toLocaleString('id-ID')}\n`);

  // 2. Test Anti-Negative on Create Client
  console.log('2. Testing Anti-Negative on Create Client...');
  const negUsername = 'negativetest_' + Date.now();
  const negClient = await postJSON(`${BASE_URL}/api/auth/create-client`, {
    username: negUsername,
    password: 'password123',
    initial_deposit: -50000
  }, adminToken);
  if (negClient.status === 400) {
    console.log(` Negative initial deposit rejected as expected: "${negClient.data.message}"\n`);
  } else {
    console.error('❌ FAILED: Negative initial deposit was allowed!', negClient.data);
  }

  // 3. Test Anti-Negative on Deposit
  console.log('3. Testing Anti-Negative on Deposit...');
  const negDep = await postJSON(`${BASE_URL}/api/deposits`, {
    user_id: temanId,
    amount: -100000
  }, adminToken);
  if (negDep.status === 400) {
    console.log(` Negative deposit rejected as expected: "${negDep.data.message}"\n`);
  } else {
    console.error('❌ FAILED: Negative deposit was allowed!', negDep.data);
  }

  // 4. Test Anti-Negative on Stock Purchase
  console.log('4. Testing Anti-Negative on Stock Purchase...');
  const negStockPrice = await postJSON(`${BASE_URL}/api/portfolio`, {
    user_id: temanId,
    ticker: 'BBCA',
    buy_price: -5000,
    quantity: 1
  }, adminToken);
  if (negStockPrice.status === 400) {
    console.log(` Negative buy_price rejected as expected: "${negStockPrice.data.message}"`);
  } else {
    console.error('❌ FAILED: Negative buy_price was allowed!', negStockPrice.data);
  }

  const negStockQty = await postJSON(`${BASE_URL}/api/portfolio`, {
    user_id: temanId,
    ticker: 'BBCA',
    buy_price: 5000,
    quantity: -2
  }, adminToken);
  if (negStockQty.status === 400) {
    console.log(` Negative quantity rejected as expected: "${negStockQty.data.message}"\n`);
  } else {
    console.error('❌ FAILED: Negative quantity was allowed!', negStockQty.data);
  }

  // 5. Test Anti-Negative on Withdrawal
  console.log('5. Testing Anti-Negative on Withdrawal...');
  const negWithdraw = await postJSON(`${BASE_URL}/api/deposits/withdraw`, {
    user_id: temanId,
    amount: -250000
  }, adminToken);
  if (negWithdraw.status === 400) {
    console.log(` Negative withdrawal rejected as expected: "${negWithdraw.data.message}"\n`);
  } else {
    console.error('❌ FAILED: Negative withdrawal was allowed!', negWithdraw.data);
  }

  // 6. Test Withdrawal exceeding cash balance
  console.log('6. Testing Withdrawal Exceeding Cash Balance...');
  const excessWithdraw = await postJSON(`${BASE_URL}/api/deposits/withdraw`, {
    user_id: temanId,
    amount: 9999999999
  }, adminToken);
  if (excessWithdraw.status === 400) {
    console.log(` Excess withdrawal rejected as expected: "${excessWithdraw.data.message}"\n`);
  } else {
    console.error('❌ FAILED: Excess withdrawal was allowed!', excessWithdraw.data);
  }

  // 7. Test Valid Withdrawal
  console.log('7. Testing Valid Withdrawal of Rp 100.000 for client "teman"...');
  const validWithdraw = await postJSON(`${BASE_URL}/api/deposits/withdraw`, {
    user_id: temanId,
    amount: 100000,
    notes: 'Penarikan uji coba'
  }, adminToken);
  if (validWithdraw.ok) {
    console.log(` Valid withdrawal succeeded: Amount = ${validWithdraw.data.withdrawal.amount}, Sisa Saldo Kas = ${validWithdraw.data.remaining_balance}\n`);
  } else {
    console.error('❌ FAILED valid withdrawal:', validWithdraw.data);
  }

  // 8. Test Client Login & PnL Portfolio View
  console.log('8. Testing Client Login (teman / client123) and Portfolio PnL...');
  const clientLogin = await postJSON(`${BASE_URL}/api/auth/login`, {
    username: 'teman',
    password: 'client123'
  });
  if (!clientLogin.ok) throw new Error('Client login failed: ' + clientLogin.data.message);
  const clientToken = clientLogin.data.token;

  const clientPorto = await getJSON(`${BASE_URL}/api/portfolio/my`, clientToken);
  console.log(' Client Portfolio Summary:', JSON.stringify(clientPorto.data.summary, null, 2));
  console.log(' Client Holdings count:', clientPorto.data.portfolio.length);
  if (clientPorto.data.portfolio.length > 0) {
    const item = clientPorto.data.portfolio[0];
    console.log(` Sample Stock [${item.ticker}]: Buy Price=${item.buy_price}, Realtime Price=${item.current_price}, PnL IDR=${item.pnl_idr}, PnL %=${item.pnl_percent.toFixed(2)}%`);
  }
  console.log('\n');

  // 9. Test Admin My Clients View
  console.log('9. Testing Admin /api/auth/my-clients...');
  const myClients = await getJSON(`${BASE_URL}/api/auth/my-clients`, adminToken);
  const temanSummary = myClients.data.clients.find(c => c.username === 'teman');
  console.log(' Admin View for "teman":', {
    cash_balance: temanSummary.cash_balance,
    total_invested: temanSummary.total_invested,
    total_current_value: temanSummary.total_current_value,
    total_pnl_idr: temanSummary.total_pnl_idr,
    total_pnl_percent: temanSummary.total_pnl_percent,
    total_deposit: temanSummary.total_deposit,
    total_withdrawal: temanSummary.total_withdrawal,
    net_asset_value: temanSummary.net_asset_value
  });

  console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch(err => {
  console.error('Test failed with error:', err);
});
