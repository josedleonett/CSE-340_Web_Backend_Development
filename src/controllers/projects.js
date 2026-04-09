import { body, validationResult } from 'express-validator';
import { getUpcomingProjects, getProjectDetails, createProject, updateProject, addVolunteer, removeVolunteer, getVolunteeredProjects, isUserVolunteered } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { getCategoriesByProject } from '../models/categories.js';

const projectValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required')
    .isLength({ max: 200 }).withMessage('Location cannot exceed 200 characters'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Please provide a valid date'),
  body('organization_id')
    .notEmpty().withMessage('Organization is required')
    .isInt().withMessage('Please select a valid organization'),
];

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
    let volunteered = false;
    if (res.locals.user) {
      volunteered = await isUserVolunteered(res.locals.user.user_id, projectId);
    }
    res.render('project', { title, project, categories, volunteered });
  } catch (error) {
    console.error('Error retrieving project details:', error);
    res.status(500).render('project', {
      title: 'Service Project Details',
      project: null,
      categories: [],
      volunteered: false,
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

const showNewProjectForm = async (req, res) => {
  try {
    const organizations = await getAllOrganizations();
    const title = 'Add New Project';
    res.render('new-project', { title, organizations });
  } catch (error) {
    console.error('Error loading new project form:', error);
    res.status(500).send('Error loading form');
  }
};

const processNewProjectForm = async (req, res) => {
  const results = validationResult(req);
  if (!results.isEmpty()) {
    results.array().forEach(error => req.flash('error', error.msg));
    return res.redirect('/new-project');
  }
  const { title, description, location, date, organization_id } = req.body;
  const projectId = await createProject(title, description, location, date, organization_id);
  req.flash('success', 'Project created successfully!');
  res.redirect(`/project/${projectId}`);
};

const processEditProjectForm = async (req, res) => {
  const results = validationResult(req);
  const projectId = req.params.id;
  if (!results.isEmpty()) {
    results.array().forEach(error => req.flash('error', error.msg));
    return res.redirect(`/edit-project/${projectId}`);
  }
  try {
    const { title, description, date, location, organization_id } = req.body;
    await updateProject(projectId, title, description, date, location, organization_id);
    req.flash('success', 'Project updated successfully!');
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).send('Error updating project');
  }
};

const processAddVolunteer = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.session.user.user_id;
  await addVolunteer(userId, projectId);
  req.flash('success', 'You are now volunteering for this project!');
  res.redirect(`/project/${projectId}`);
};

const processRemoveVolunteer = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.session.user.user_id;
  await removeVolunteer(userId, projectId);
  req.flash('success', 'You have been removed as a volunteer.');
  res.redirect(req.headers.referer || `/project/${projectId}`);
};

const showVolunteeringPage = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const projects = await getVolunteeredProjects(userId);
    res.render('volunteering', { title: 'My Volunteering', projects });
  } catch (error) {
    console.error('Error retrieving volunteered projects:', error);
    res.status(500).render('volunteering', { title: 'My Volunteering', projects: [], error: 'Error loading volunteering list' });
  }
};

export { projectValidation, showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, showEditProjectForm, processEditProjectForm, processAddVolunteer, processRemoveVolunteer, showVolunteeringPage };
