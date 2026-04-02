import pool from '../database.js';

export async function getAllProjects() {
  try {
    const result = await pool.query(`
      SELECT 
        p.project_id,
        p.title,
        p.description,
        p.location,
        p.date,
        o.organization_name
      FROM projects p
      JOIN organizations o ON p.organization_id = o.organization_id
      ORDER BY p.date DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
}

export async function getProjectsByOrganization(organizationId) {
  try {
    const result = await pool.query(`
      SELECT 
        p.project_id,
        p.title,
        p.description,
        p.location,
        p.date,
        o.organization_name
      FROM projects p
      JOIN organizations o ON p.organization_id = o.organization_id
      WHERE p.organization_id = $1
      ORDER BY p.date DESC
    `, [organizationId]);
    return result.rows;
  } catch (error) {
    console.error('Error getting projects by organization:', error);
    throw error;
  }
}

export async function getProjectById(projectId) {
  try {
    const result = await pool.query(`
      SELECT 
        p.project_id,
        p.title,
        p.description,
        p.location,
        p.date,
        p.organization_id,
        o.organization_name
      FROM projects p
      JOIN organizations o ON p.organization_id = o.organization_id
      WHERE p.project_id = $1
    `, [projectId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting project by id:', error);
    throw error;
  }
}
