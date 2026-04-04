import { body, validationResult } from 'express-validator';
import { getAllOrganizations, getOrganizationDetails, createOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganization } from '../models/projects.js';

const organizationValidation = [
  body('organization_name')
    .trim()
    .notEmpty().withMessage('Organization name is required')
    .isLength({ min: 3, max: 255 }).withMessage('Organization name must be between 3 and 255 characters'),
  body('mission')
    .trim()
    .notEmpty().withMessage('Mission is required')
    .isLength({ max: 1000 }).withMessage('Mission cannot exceed 1000 characters'),
  body('contact_email')
    .normalizeEmail()
    .notEmpty().withMessage('Contact email is required')
    .isEmail().withMessage('Please provide a valid email address'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .isLength({ max: 20 }).withMessage('Phone cannot exceed 20 characters'),
];

const showOrganizationsPage = async (req, res) => {
  try {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
  } catch (error) {
    console.error('Error retrieving organizations:', error);
    res.status(500).render('organizations', {
      title: 'Our Partner Organizations',
      organizations: [],
      error: 'Error retrieving organizations from database'
    });
  }
};

const showOrganizationDetailsPage = async (req, res) => {
  try {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganization(organizationId);
    const title = 'Organization Details';
    res.render('organization', { title, organizationDetails, projects });
  } catch (error) {
    console.error('Error retrieving organization details:', error);
    res.status(500).render('organization', {
      title: 'Organization Details',
      organizationDetails: null,
      projects: [],
      error: 'Error retrieving organization details from database'
    });
  }
};

const showNewOrganizationForm = async (req, res) => {
  const title = 'Add New Organization';
  res.render('new-organization', { title });
};

const processNewOrganizationForm = async (req, res) => {
  const results = validationResult(req);
  if (!results.isEmpty()) {
    results.array().forEach(error => req.flash('error', error.msg));
    return res.redirect('/new-organization');
  }
  const { organization_name, mission, contact_email, phone } = req.body;
  const organizationId = await createOrganization(organization_name, mission, contact_email, phone);
  req.flash('success', 'Organization created successfully!');
  res.redirect(`/organization/${organizationId}`);
};

const showEditOrganizationForm = async (req, res) => {
  try {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const title = 'Edit Organization';
    res.render('edit-organization', { title, organizationDetails });
  } catch (error) {
    console.error('Error retrieving organization for edit:', error);
    res.status(500).send('Error retrieving organization data');
  }
};

const processEditOrganizationForm = async (req, res) => {
  const results = validationResult(req);
  const organizationId = req.params.id;
  if (!results.isEmpty()) {
    results.array().forEach(error => req.flash('error', error.msg));
    return res.redirect(`/edit-organization/${organizationId}`);
  }
  const { organization_name, mission, contact_email, phone } = req.body;
  await updateOrganization(organizationId, organization_name, mission, contact_email, phone);
  req.flash('success', 'Organization updated successfully!');
  res.redirect(`/organization/${organizationId}`);
};

export {
  organizationValidation,
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm,
};

