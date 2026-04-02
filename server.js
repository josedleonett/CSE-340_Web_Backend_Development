import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import * as projectsModel from './src/models/projects.js';

dotenv.config();

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

app.get('/organizations', (req, res) => {
  res.render('organizations', { title: 'Organizations' });
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

app.get('/categories', (req, res) => {
  res.render('categories', { title: 'Service Project Categories' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
