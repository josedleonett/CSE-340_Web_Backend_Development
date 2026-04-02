import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProject } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
  try {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
  } catch (error) {
    console.error('Error retrieving projects:', error);
    res.status(500).render('projects', {
      title: 'Upcoming Service Projects',
      projects: [],
      error: 'Error retrieving projects from database'
    });
  }
};

const showProjectDetailsPage = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const categories = await getCategoriesByProject(projectId);
    const title = 'Service Project Details';
    res.render('project', { title, project, categories });
  } catch (error) {
    console.error('Error retrieving project details:', error);
    res.status(500).render('project', {
      title: 'Service Project Details',
      project: null,
      categories: [],
      error: 'Error retrieving project details from database'
    });
  }
};

export { showProjectsPage, showProjectDetailsPage };
