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

export async function getOrganizationDetails(organizationId) {
  try {
    const result = await pool.query(
      `SELECT organization_id, organization_name, mission, contact_email, phone
       FROM organizations
       WHERE organization_id = $1`,
      [organizationId]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error getting organization details:', error);
    throw error;
  }
}
