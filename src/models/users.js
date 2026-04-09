import pool from '../database.js';
import bcrypt from 'bcrypt';

export const createUser = async (name, email, passwordHash) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, role_id)
     VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = 'user'))
     RETURNING user_id`,
    [name, email, passwordHash]
  );
  if (result.rows.length === 0) throw new Error('Failed to create user');
  return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
  const query = `
    SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.email = $1
  `;
  const result = await pool.query(query, [email]);
  if (result.rows.length === 0) return null;
  return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

export const authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const match = await verifyPassword(password, user.password_hash);
  if (!match) return null;
  delete user.password_hash;
  return user;
};

export const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT u.user_id, u.name, u.email, r.role_name
     FROM users u
     JOIN roles r ON u.role_id = r.role_id
     ORDER BY u.name`
  );
  return result.rows;
};
