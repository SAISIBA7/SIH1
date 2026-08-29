import mysql from 'mysql2/promise';

(async () => {
  const c = await mysql.createConnection({
    host: 'sih-mysql.cley86o8g8vx.eu-north-1.rds.amazonaws.com',
    port: 3306, user: 'admin', password: 'kFjzqqPYEQb2awh',
    database: 'sih', connectTimeout: 30000
  });

  const farmerId = 'FRM_47166869_622'; // Test farmer from earlier registration

  const now = new Date();
  const hoursAgo = (h) => new Date(now.getTime() - h * 3600000).toISOString().slice(0, 19).replace('T', ' ');

  const notifications = [
    {
      id: 'NTF_001', user_id: farmerId, farmer_id: farmerId,
      type: 'risk', category: 'Risk', priority: 'critical',
      title: 'Your crop distress risk increased to 81/100',
      message: 'Based on recent rainfall shortages and your upcoming loan deadline, your risk score is now critical.',
      body: JSON.stringify({
        whatHappened: 'Your overall crop distress score has crossed the critical threshold of 80, reaching 81/100. This is driven by compounding moisture stress and approaching KCC repayment.',
        whyReasons: ['22% rainfall deficit in Baripada block over 14 days', 'Soil moisture dropped to 24% at 15cm depth', 'KCC loan repayment due on Nov 30, 2026', 'Paddy is in panicle initiation — vulnerable window'],
        recommendedAction: 'Apply supplementary irrigation within 48 hours. Contact CHC for emergency pump rental. Review KCC interest subvention eligibility.'
      }),
      voice_text: 'Your crop distress risk has increased to 81 out of 100. Rainfall deficit and loan deadline are contributing factors. Please apply supplementary irrigation within 48 hours.',
      language: 'en',
      action_label: 'View Risk Details', action_url: '/risk-details',
      action_status: 'required', source_feature: 'RISK_ENGINE', source_entity_id: 'RS_001',
      correlation_id: 'CORR_RISK_001', is_read: 0, created_at: hoursAgo(2)
    },
    {
      id: 'NTF_002', user_id: farmerId, farmer_id: farmerId,
      type: 'weather', category: 'Weather', priority: 'warning',
      title: 'Heavy rainfall expected tomorrow',
      message: '65mm of rain is forecast for Mayurbhanj tomorrow. Your paddy is in vegetative stage — this raises waterlogging risk.',
      body: JSON.stringify({
        whatHappened: 'IMD Doppler radar forecast indicates 65mm rainfall for Mayurbhanj district tomorrow. Given current high soil moisture saturation, this significantly raises waterlogging risk for your paddy field.',
        whyReasons: ['Your district — Mayurbhanj is in the forecast zone', 'Your crop stage — vegetative (waterlogging-sensitive)', 'Current soil moisture already near field capacity'],
        recommendedAction: 'Check field drainage channels today. Clear any blockages before rainfall arrives. Consider temporary bunding if field is low-lying.'
      }),
      voice_text: 'Heavy rainfall of 65 millimeters is expected tomorrow in Mayurbhanj. Please check your field drainage today to prevent waterlogging.',
      language: 'en',
      action_label: 'View Advisory', action_url: '/crop-monitoring',
      action_status: 'required', source_feature: 'WEATHER', source_entity_id: 'WA_002',
      correlation_id: 'CORR_WEATHER_001', is_read: 0, created_at: hoursAgo(5)
    },
    {
      id: 'NTF_003', user_id: farmerId, farmer_id: farmerId,
      type: 'crop_activity', category: 'Crop Activities', priority: 'info',
      title: 'Soil inspection due today',
      message: 'Remember to check your field drainage today before the expected rainfall arrives.',
      body: JSON.stringify({
        whatHappened: 'Your crop calendar indicates a routine soil inspection is scheduled for today. Given the weather advisory, this is especially important.',
        whyReasons: ['Scheduled crop calendar task for today', 'Weather advisory active for your district'],
        recommendedAction: 'Walk your field borders. Inspect drainage channels for blockages. Note any standing water areas.'
      }),
      voice_text: 'Soil inspection is due today. Please check your field drainage before the expected rainfall.',
      language: 'en',
      action_label: 'Open Crop Plan', action_url: '/full-crop-guide',
      action_status: 'not_required', source_feature: 'CROP_CALENDAR', source_entity_id: 'CC_003',
      correlation_id: 'CORR_CROP_001', is_read: 0, created_at: hoursAgo(8)
    },
    {
      id: 'NTF_004', user_id: farmerId, farmer_id: farmerId,
      type: 'market', category: 'Market', priority: 'info',
      title: 'Paddy price decreased 8%',
      message: 'Local mandi prices for Paddy have seen a drop over the last 48 hours. Consider holding stock if possible.',
      body: JSON.stringify({
        whatHappened: 'Modal paddy price at Baripada APMC dropped from ₹2,180 to ₹2,005 per quintal — an 8% decline in 48 hours due to fresh arrival surge.',
        whyReasons: ['Your crop — Paddy (Swarna MTU 7029)', 'Your nearest mandi — Baripada APMC', 'Price below MSP threshold'],
        recommendedAction: 'Compare prices at nearby mandis (Balasore, Keonjhar). Consider holding stock for 7-10 days if storage is available.'
      }),
      voice_text: 'Paddy price has decreased by 8 percent at Baripada mandi. Current price is 2005 rupees per quintal. You may compare prices at nearby mandis.',
      language: 'en',
      action_label: 'Compare Mandis', action_url: '/market',
      action_status: 'not_required', source_feature: 'MANDI', source_entity_id: 'MP_004',
      correlation_id: 'CORR_MARKET_001', is_read: 1, read_at: hoursAgo(20), created_at: hoursAgo(28)
    },
    {
      id: 'NTF_005', user_id: farmerId, farmer_id: farmerId,
      type: 'government', category: 'Government', priority: 'info',
      title: 'New Solar Pump scheme available',
      message: 'A new subsidy is available for solar water pumps. Check if you are eligible based on your land size.',
      body: JSON.stringify({
        whatHappened: 'PM-KUSUM Component B has opened new applications for solar pump sets. Your land area (4.5 acres) qualifies for the 5HP category with 60% central subsidy.',
        whyReasons: ['New scheme matching your farm profile', 'Land area qualifies for 5HP pump category', 'Your district is in the eligible zone'],
        recommendedAction: 'Review scheme details and document checklist. Apply before the deadline of December 15, 2026.'
      }),
      voice_text: 'A new solar pump scheme is available. Your land area qualifies for 60 percent subsidy. Please check the details and apply before December 15.',
      language: 'en',
      action_label: 'View Scheme Details', action_url: '/schemes',
      action_status: 'required', source_feature: 'SCHEMES', source_entity_id: 'SCH_005',
      correlation_id: 'CORR_SCHEME_001', is_read: 1, read_at: hoursAgo(40), created_at: hoursAgo(52)
    },
    {
      id: 'NTF_006', user_id: farmerId, farmer_id: farmerId,
      type: 'insurance', category: 'Insurance', priority: 'warning',
      title: 'Premium payment due in 5 days',
      message: 'Your crop insurance premium is due soon. Pay early to ensure uninterrupted coverage.',
      body: JSON.stringify({
        whatHappened: 'Your PMFBY Kharif 2026 premium of ₹1,250 for Paddy coverage is due on September 3, 2026. Non-payment will result in loss of coverage.',
        whyReasons: ['Your active PMFBY policy — Kharif 2026', 'Payment deadline — September 3, 2026', 'Premium amount — ₹1,250'],
        recommendedAction: 'Pay the premium at your nearest CSC or bank branch. You can also pay via the PMFBY portal.'
      }),
      voice_text: 'Your crop insurance premium of 1250 rupees is due in 5 days. Please pay at your nearest bank or CSC to maintain coverage.',
      language: 'en',
      action_label: 'Review Policy', action_url: '/insurance',
      action_status: 'required', source_feature: 'INSURANCE', source_entity_id: 'INS_006',
      correlation_id: 'CORR_INS_001', is_read: 1, read_at: hoursAgo(60), created_at: hoursAgo(76)
    },
    {
      id: 'NTF_007', user_id: farmerId, farmer_id: farmerId,
      type: 'officer_update', category: 'Officer Updates', priority: 'info',
      title: 'New advisory posted for Mayurbhanj',
      message: 'The agricultural officer has posted a new seasonal advisory for pest control in your district.',
      body: JSON.stringify({
        whatHappened: 'District Agricultural Officer (Mayurbhanj) has issued advisory #ADV-2026-087 regarding Brown Plant Hopper management in paddy. The advisory includes recommended pesticide schedules and organic alternatives.',
        whyReasons: ['Your district — Mayurbhanj', 'Your crop — Paddy is in the advisory scope', 'Seasonal pest advisory period'],
        recommendedAction: 'Read the full advisory. Note the recommended spray schedule for your crop stage.'
      }),
      voice_text: 'The agricultural officer has posted a new pest control advisory for Mayurbhanj. Please read the advisory for recommended spray schedule.',
      language: 'en',
      action_label: 'Read Advisory', action_url: '/farmer-profile',
      action_status: 'not_required', source_feature: 'OFFICER', source_entity_id: 'ADV_007',
      correlation_id: 'CORR_OFF_001', is_read: 1, read_at: hoursAgo(100), created_at: hoursAgo(124)
    }
  ];

  for (const n of notifications) {
    const cols = Object.keys(n).join(', ');
    const placeholders = Object.keys(n).map(() => '?').join(', ');
    try {
      await c.query(`INSERT INTO notifications (${cols}) VALUES (${placeholders})`, Object.values(n));
      console.log(`✅ Inserted: ${n.id} — ${n.title}`);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') console.log(`⏭️ Already exists: ${n.id}`);
      else console.log(`❌ Error: ${n.id}`, e.message);
    }
  }

  const [count] = await c.query('SELECT COUNT(*) as cnt FROM notifications');
  console.log(`\n📊 Total notifications in RDS: ${count[0].cnt}`);
  await c.end();
})();
