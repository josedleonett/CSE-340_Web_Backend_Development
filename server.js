import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import * as projectsModel from './src/models/projects.js';
import * as organizationsModel from './src/models/organizations.js';
import * as categoriesModel from './src/models/categories.js';

dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/organizations', async (req, res) => {
  try {
    const organizations = await organizationsModel.getAllOrganizations();
    res.render('organizations', { title: 'Organizations', organizations });
  } catch (error) {
    console.error('Error retrieving organizations:', error);
    res.status(500).render('organizations', {
      title: 'Organizations',
      organizations: [],
      error: 'Error retrieving organizations from database'
    });
  }
});

app.get('/projects', async (req, res) => {
  try {
    const projects = await projectsModel.getAllProjects();
    console.log('Projects retrieved:', projects);
    res.render('projects', { title: 'Service Projects', projects });
  } catch (error) {
    console.error('Error retrieving projects:', error);
    res.status(500).render('projects', { 
      title: 'Service Projects', 
      projects: [],
      error: 'Error retrieving projects from database'
    });
  }
});

app.get('/categories', async (req, res) => {
  try {
    const categories = await categoriesModel.getAllCategories();
    res.render('categories', { title: 'Service Project Categories', categories });
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).render('categories', {
      title: 'Service Project Categories',
      categories: [],
      error: 'Error retrieving categories from database'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
