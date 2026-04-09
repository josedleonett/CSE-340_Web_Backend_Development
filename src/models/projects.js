import pool from '../database.js';

export const getAllProjects = async () => {
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
};

export const getProjectsByOrganization = async (organizationId) => {
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
};

export const getProjectById = async (projectId) => {
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
};

export const getUpcomingProjects = async (number_of_projects) => {
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
};

export const getProjectDetails = async (id) => {
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
};

export const createProject = async (title, description, location, date, organizationId) => {
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
};

export const updateProject = async (id, title, description, date, location, organizationId) => {
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
};

export const addVolunteer = async (userId, projectId) => {
  await pool.query(
    `INSERT INTO user_volunteers (user_id, project_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [userId, projectId]
  );
};

export const removeVolunteer = async (userId, projectId) => {
  await pool.query(
    `DELETE FROM user_volunteers WHERE user_id = $1 AND project_id = $2`,
    [userId, projectId]
  );
};

export const getVolunteeredProjects = async (userId) => {
  const result = await pool.query(
    `SELECT p.project_id, p.title, p.description, p.date, p.location, o.organization_name
     FROM projects p
     JOIN user_volunteers uv ON p.project_id = uv.project_id
     JOIN organizations o ON p.organization_id = o.organization_id
     WHERE uv.user_id = $1
     ORDER BY p.date ASC`,
    [userId]
  );
  return result.rows;
};

export const isUserVolunteered = async (userId, projectId) => {
  const result = await pool.query(
    `SELECT 1 FROM user_volunteers WHERE user_id = $1 AND project_id = $2`,
    [userId, projectId]
  );
  return result.rowCount > 0;
};
