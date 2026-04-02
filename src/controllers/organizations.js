import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganization } from '../models/projects.js';

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

export { showOrganizationsPage, showOrganizationDetailsPage };
