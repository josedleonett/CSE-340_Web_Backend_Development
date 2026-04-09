import pool from '../database.js';

export const getAllCategories = async () => {
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
};

export const getCategoryById = async (categoryId) => {
  try {
    const result = await pool.query(
      `SELECT category_id, category_name
       FROM categories
       WHERE category_id = $1`,
      [categoryId]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error getting category by id:', error);
    throw error;
  }
};

export const getProjectsByCategory = async (categoryId) => {
  try {
    const result = await pool.query(
      `SELECT p.project_id, p.title, p.description, p.date, p.location,
              p.organization_id, o.organization_name
       FROM projects p
       JOIN project_categories pc ON p.project_id = pc.project_id
       JOIN organizations o ON p.organization_id = o.organization_id
       WHERE pc.category_id = $1
       ORDER BY p.date ASC`,
      [categoryId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting projects by category:', error);
    throw error;
  }
};

export const getCategoriesByProject = async (projectId) => {
  try {
    const result = await pool.query(
      `SELECT c.category_id, c.category_name
       FROM categories c
       JOIN project_categories pc ON c.category_id = pc.category_id
       WHERE pc.project_id = $1
       ORDER BY c.category_name ASC`,
      [projectId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting categories by project:', error);
    throw error;
  }
};

export const createCategory = async (categoryName) => {
  try {
    const result = await pool.query(
      `INSERT INTO categories (category_name) VALUES ($1) RETURNING category_id`,
      [categoryName]
    );
    return result.rows[0].category_id;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id, categoryName) => {
  try {
    const result = await pool.query(
      `UPDATE categories SET category_name = $1 WHERE category_id = $2 RETURNING *`,
      [categoryName, id]
    );
    if (result.rowCount === 0) throw new Error('No category found with that ID');
    return result.rows[0];
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const updateCategoryAssignments = async (projectId, categoryIds) => {
  try {
    await pool.query(`DELETE FROM project_categories WHERE project_id = $1`, [projectId]);
    if (categoryIds && categoryIds.length > 0) {
      for (const categoryId of categoryIds) {
        await pool.query(
          `INSERT INTO project_categories (project_id, category_id) VALUES ($1, $2)`,
          [projectId, categoryId]
        );
      }
    }
  } catch (error) {
    console.error('Error updating category assignments:', error);
    throw error;
  }
};
