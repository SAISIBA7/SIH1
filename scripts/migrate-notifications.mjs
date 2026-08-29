import mysql from 'mysql2/promise';

(async () => {
  const c = await mysql.createConnection({
    host: 'sih-mysql.cley86o8g8vx.eu-north-1.rds.amazonaws.com',
    port: 3306, user: 'admin', password: 'kFjzqqPYEQb2awh',
    database: 'sih', connectTimeout: 30000
  });

  const adds = [
    ['category', "VARCHAR(50) DEFAULT NULL AFTER type"],
    ['body', "JSON DEFAULT NULL AFTER message"],
    ['voice_text', "TEXT DEFAULT NULL AFTER body"],
    ['language', "VARCHAR(10) DEFAULT 'en' AFTER voice_text"],
    ['action_status', "ENUM('not_required','required','in_progress','completed','expired') DEFAULT 'not_required' AFTER action_url"],
    ['source_feature', "VARCHAR(50) DEFAULT NULL AFTER action_status"],
    ['source_entity_id', "VARCHAR(50) DEFAULT NULL AFTER source_feature"],
    ['correlation_id', "VARCHAR(50) DEFAULT NULL AFTER source_entity_id"],
    ['read_at', "DATETIME DEFAULT NULL AFTER is_read"],
  ];

  for (const [col, def] of adds) {
    try {
      await c.query(`ALTER TABLE notifications ADD COLUMN ${col} ${def}`);
      console.log('✅ Added:', col);
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('⏭️ Already exists:', col);
      else console.log('❌ Error adding', col, ':', e.message);
    }
  }

  // Map existing 'type' values to 'category' where category is null
  const [upd] = await c.query(`UPDATE notifications SET category = type WHERE category IS NULL AND type IS NOT NULL`);
  console.log('Mapped type -> category:', upd.affectedRows, 'rows');

  console.log('\n📋 Final notifications schema:');
  const [r] = await c.query('DESCRIBE notifications');
  console.table(r);
  await c.end();
})();
