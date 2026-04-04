import { getUpcomingProjects, getProjectDetails, updateProject } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
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

const showEditProjectForm = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();
    const title = 'Edit Service Project';
    res.render('edit-project', { title, project, organizations });
  } catch (error) {
    console.error('Error retrieving project for edit:', error);
    res.status(500).render('edit-project', {
      title: 'Edit Service Project',
      project: null,
      organizations: [],
      error: 'Error retrieving project data'
    });
  }
};

const processEditProjectForm = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { title, description, date, location, organization_id } = req.body;
    await updateProject(projectId, title, description, date, location, organization_id);
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).send('Error updating project');
  }
};

export { showProjectsPage, showProjectDetailsPage, showEditProjectForm, processEditProjectForm };
