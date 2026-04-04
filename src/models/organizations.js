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

export async function createOrganization(organizationName, mission, contactEmail, phone) {
  const result = await pool.query(
    `INSERT INTO organizations (organization_name, mission, contact_email, phone)
     VALUES ($1, $2, $3, $4)
     RETURNING organization_id`,
    [organizationName, mission, contactEmail, phone]
  );
  if (result.rows.length === 0) throw new Error('Failed to create organization');
  return result.rows[0].organization_id;
}

export async function updateOrganization(id, organizationName, mission, contactEmail, phone) {
  const result = await pool.query(
    `UPDATE organizations
     SET organization_name = $1, mission = $2, contact_email = $3, phone = $4
     WHERE organization_id = $5
     RETURNING *`,
    [organizationName, mission, contactEmail, phone, id]
  );
  if (result.rowCount === 0) throw new Error('No organization found with that ID');
  return result.rows[0];
}

