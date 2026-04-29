const mysql2 = require('mysql2/promise');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const useDatabaseUrl = !!process.env.DATABASE_URL;
const useSSL = process.env.DB_SSL === 'true' || (isProduction && useDatabaseUrl);

const basePoolConfig = {
  waitForConnections: true,
<<<<<<< HEAD
  connectionLimit:    10,
  queueLimit:         0,
  charset:            'utf8mb4',
  // ssl: {
  //   rejectUnauthorized: true
  // }
});
=======
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0,
  charset: 'utf8mb4'
};

const poolConfig = useDatabaseUrl
  ? {
      ...basePoolConfig,
      uri: process.env.DATABASE_URL
    }
  : {
      ...basePoolConfig,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    };

if (useSSL) {
  poolConfig.ssl = { rejectUnauthorized: true };
}

const pool = mysql2.createPool(poolConfig);
>>>>>>> 51944d075ffc853ac9cd5650d9b435ddae024eb9

// Test de connexion au démarrage
pool.getConnection()
  .then(conn => {
    console.log('✅ Connexion MySQL établie');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Erreur connexion MySQL :', err.message);
    process.exit(1);
  });

module.exports = pool;
