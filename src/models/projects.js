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

export async function getUpcomingProjects(number_of_projects) {
  try {
    const result = await pool.query(
      `SELECT
        p.project_id,
        p.title,
        p.description,
        p.date,
        p.location,
        p.organization_id,
        o.organization_name
       FROM projects p
       JOIN organizations o ON p.organization_id = o.organization_id
       WHERE p.date >= CURRENT_DATE
       ORDER BY p.date ASC
       LIMIT $1`,
      [number_of_projects]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting upcoming projects:', error);
    throw error;
  }
}

export async function getProjectDetails(id) {
  try {
    const result = await pool.query(
      `SELECT
        p.project_id,
        p.title,
        p.description,
        p.date,
        p.location,
        p.organization_id,
        o.organization_name
       FROM projects p
       JOIN organizations o ON p.organization_id = o.organization_id
       WHERE p.project_id = $1`,
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting project details:', error);
    throw error;
  }
}

export async function createProject(title, description, location, date, organizationId) {
  try {
    const result = await pool.query(
      `INSERT INTO projects (title, description, location, date, organization_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING project_id`,
      [title, description, location, date, organizationId]
    );
    return result.rows[0].project_id;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function updateProject(id, title, description, date, location, organizationId) {
  const result = await pool.query(
    `UPDATE projects
     SET title = $1, description = $2, date = $3, location = $4, organization_id = $5
     WHERE project_id = $6
     RETURNING *`,
    [title, description, date, location, organizationId, id]
  );
  if (result.rowCount === 0) {
    throw new Error('No project found with that ID');
  }
  return result.rows[0];
}
