import pool from '../database.js';

export async function getAllOrganizations() {
  try {
    const result = await pool.query(`
      SELECT organization_id, organization_name, mission, contact_email, phone
      FROM organizations
      ORDER BY organization_name ASC
    `);
    return result.rows;
  } catch (error) {
    console.error('Error getting organizations:', error);
    throw error;
  }
}
