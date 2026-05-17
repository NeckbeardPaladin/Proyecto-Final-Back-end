const { getPool, sql } = require('../config/db');

async function create(userId, { title, description, status, due_date }) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('title', sql.NVarChar(255), title)
    .input('description', sql.NVarChar(sql.MAX), description ?? null)
    .input('status', sql.NVarChar(20), status || 'pending')
    .input('due_date', sql.Date, due_date || null)
    .input('userId', sql.Int, userId)
    .query(`
      INSERT INTO dbo.tasks (title, description, status, due_date, user_id)
      OUTPUT INSERTED.*
      VALUES (@title, @description, @status, @due_date, @userId)
    `);
  return result.recordset[0];
}

async function findAllByUser(userId, filters = {}) {
  const pool = await getPool();
  const request = pool.request().input('userId', sql.Int, userId);

  let query = 'SELECT * FROM dbo.tasks WHERE user_id = @userId';

  if (filters.status) {
    request.input('status', sql.NVarChar(20), filters.status);
    query += ' AND status = @status';
  }

  if (filters.due_date) {
    request.input('due_date', sql.Date, filters.due_date);
    query += ' AND due_date = @due_date';
  }

  query += ' ORDER BY id DESC';

  const result = await request.query(query);
  return result.recordset;
}

async function findByIdForUser(id, userId) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .input('userId', sql.Int, userId)
    .query('SELECT * FROM dbo.tasks WHERE id = @id AND user_id = @userId');
  return result.recordset[0] || null;
}

async function update(id, userId, fields) {
  const existing = await findByIdForUser(id, userId);
  if (!existing) return null;

  const pool = await getPool();
  const request = pool
    .request()
    .input('id', sql.Int, id)
    .input('userId', sql.Int, userId);

  const updates = [];
  if (fields.title !== undefined) {
    request.input('title', sql.NVarChar(255), fields.title);
    updates.push('title = @title');
  }
  if (fields.description !== undefined) {
    request.input('description', sql.NVarChar(sql.MAX), fields.description);
    updates.push('description = @description');
  }
  if (fields.status !== undefined) {
    request.input('status', sql.NVarChar(20), fields.status);
    updates.push('status = @status');
  }
  if (fields.due_date !== undefined) {
    request.input('due_date', sql.Date, fields.due_date || null);
    updates.push('due_date = @due_date');
  }

  if (updates.length === 0) return existing;

  const result = await request.query(`
    UPDATE dbo.tasks
    SET ${updates.join(', ')}
    OUTPUT INSERTED.*
    WHERE id = @id AND user_id = @userId
  `);
  return result.recordset[0];
}

async function remove(id, userId) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .input('userId', sql.Int, userId)
    .query('DELETE FROM dbo.tasks WHERE id = @id AND user_id = @userId');
  return result.rowsAffected[0] > 0;
}

module.exports = { create, findAllByUser, findByIdForUser, update, remove };
