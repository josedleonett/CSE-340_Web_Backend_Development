import pool from '../database.js';

export async function getAllCategories() {
  try {
    const result = await pool.query(`
      SELECT category_id, category_name
      FROM categories
      ORDER BY category_name ASC
    `);
    return result.rows;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
}
