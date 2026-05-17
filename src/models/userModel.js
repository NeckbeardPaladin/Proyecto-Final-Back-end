const { getPool, sql } = require('../config/db');

async function findByEmail(email) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('email', sql.NVarChar(255), email)
    .query('SELECT id, email, password, created_at FROM dbo.users WHERE email = @email');
  return result.recordset[0] || null;
}

async function findById(id) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .query('SELECT id, email, created_at FROM dbo.users WHERE id = @id');
  return result.recordset[0] || null;
}

async function create(email, hashedPassword) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('email', sql.NVarChar(255), email)
    .input('password', sql.NVarChar(255), hashedPassword)
    .query(`
      INSERT INTO dbo.users (email, password)
      OUTPUT INSERTED.id, INSERTED.email, INSERTED.created_at
      VALUES (@email, @password)
    `);
  return result.recordset[0];
}

module.exports = { findByEmail, findById, create };
