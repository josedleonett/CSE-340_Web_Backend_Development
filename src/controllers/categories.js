import { getAllCategories, getCategoryById, getProjectsByCategory } from '../models/categories.js';

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

export { showCategoriesPage, showCategoryDetailsPage };
