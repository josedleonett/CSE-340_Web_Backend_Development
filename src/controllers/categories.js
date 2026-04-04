import { body, validationResult } from 'express-validator';
import { getAllCategories, getCategoryById, getProjectsByCategory, createCategory, updateCategory, updateCategoryAssignments } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { getCategoriesByProject } from '../models/categories.js';

const categoryValidation = [
  body('category_name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters'),
];

const showCategoriesPage = async (req, res) => {
  try {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    res.render('categories', { title, categories });
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).render('categories', {
      title: 'Service Categories',
      categories: [],
      error: 'Error retrieving categories from database'
    });
  }
};

const showCategoryDetailsPage = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategory(categoryId);
    const title = 'Category Details';
    res.render('category', { title, category, projects });
  } catch (error) {
    console.error('Error retrieving category details:', error);
    res.status(500).render('category', {
      title: 'Category Details',
      category: null,
      projects: [],
      error: 'Error retrieving category details from database'
    });
  }
};

const showNewCategoryForm = async (req, res) => {
  const title = 'Add New Category';
  res.render('new-category', { title });
};

const processNewCategoryForm = async (req, res) => {
  const results = validationResult(req);
  if (!results.isEmpty()) {
    results.array().forEach(error => req.flash('error', error.msg));
    return res.redirect('/new-category');
  }
  const { category_name } = req.body;
  const categoryId = await createCategory(category_name);
  req.flash('success', 'Category created successfully!');
  res.redirect(`/category/${categoryId}`);
};

const showEditCategoryForm = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const title = 'Edit Category';
    res.render('edit-category', { title, category });
  } catch (error) {
    console.error('Error retrieving category for edit:', error);
    res.status(500).send('Error retrieving category data');
  }
};

const processEditCategoryForm = async (req, res) => {
  const results = validationResult(req);
  const categoryId = req.params.id;
  if (!results.isEmpty()) {
    results.array().forEach(error => req.flash('error', error.msg));
    return res.redirect(`/edit-category/${categoryId}`);
  }
  const { category_name } = req.body;
  await updateCategory(categoryId, category_name);
  req.flash('success', 'Category updated successfully!');
  res.redirect(`/category/${categoryId}`);
};

const showAssignCategoriesForm = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await getProjectDetails(projectId);
    const allCategories = await getAllCategories();
    const assignedCategories = await getCategoriesByProject(projectId);
    const assignedIds = assignedCategories.map(c => c.category_id);
    const title = 'Assign Categories';
    res.render('assign-categories', { title, project, allCategories, assignedIds });
  } catch (error) {
    console.error('Error loading assign categories form:', error);
    res.status(500).send('Error loading form');
  }
};

const processAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  let categoryIds = req.body.categories;
  if (!categoryIds) categoryIds = [];
  if (!Array.isArray(categoryIds)) categoryIds = [categoryIds];
  await updateCategoryAssignments(projectId, categoryIds);
  req.flash('success', 'Categories assigned successfully!');
  res.redirect(`/project/${projectId}`);
};

export {
  categoryValidation,
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
};
