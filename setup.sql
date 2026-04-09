-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  organization_id SERIAL PRIMARY KEY,
  organization_name VARCHAR(255) NOT NULL,
  mission TEXT,
  contact_email VARCHAR(255),
  phone VARCHAR(20)
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  project_id SERIAL PRIMARY KEY,
  organization_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  date DATE,
  FOREIGN KEY (organization_id) REFERENCES organizations(organization_id),
  UNIQUE (organization_id, title)
);

-- Sample data for organizations
INSERT INTO organizations (organization_name, mission, contact_email, phone)
VALUES 
  ('Community Helpers', 'Helping neighbors in need through community initiatives', 'info@communityhelpers.org', '555-0001'),
  ('Youth Volunteers', 'Empowering young people to make a difference in communities', 'contact@youthvolunteers.org', '555-0002'),
  ('Green Earth Initiative', 'Environmental conservation and sustainability projects', 'admin@greenearth.org', '555-0003')
ON CONFLICT DO NOTHING;

-- Sample data for projects
INSERT INTO projects (organization_id, title, description, location, date)
VALUES 
  -- Community Helpers projects
  (1, 'Park Cleanup Day', 'Join us for a community cleanup at Central Park. We will be picking up litter, planting flowers, and maintaining trails.', 'Central Park', '2026-03-20'),
  (1, 'Food Bank Volunteer Day', 'Help sort and distribute food to families in need at the local food bank.', 'Downtown Food Bank', '2026-03-25'),
  (1, 'Senior Center Visit', 'Spend time with seniors, play games, and provide companionship at the local senior center.', 'Senior Center', '2026-04-05'),
  (1, 'Community Garden Planting', 'Help plant vegetables and flowers for the community garden project.', 'Community Garden', '2026-04-10'),
  (1, 'Paint Local School', 'Paint the walls and improve the appearance of the local elementary school.', 'Elementary School', '2026-04-15'),
  (1, 'Beach Cleanup', 'Clean up the local beach and remove plastic waste.', 'Local Beach', '2026-04-20'),
  
  -- Youth Volunteers projects
  (2, 'Tutoring Program', 'Volunteer to tutor students in math and reading at the community center.', 'Community Center', '2026-03-22'),
  (2, 'Youth Sports Day', 'Organize and run sports activities for local youth.', 'City Park', '2026-03-28'),
  (2, 'After School Mentoring', 'Mentor elementary school students in academic and life skills.', 'Lincoln Elementary', '2026-04-01'),
  (2, 'Career Fair Planning', 'Help organize a career fair for high school students.', 'High School Gym', '2026-04-08'),
  (2, 'Youth Art Workshop', 'Lead an art workshop for local youth to express creativity.', 'Arts Center', '2026-04-12'),
  (2, 'Tech Skills Training', 'Teach basic computer and coding skills to underserved youth.', 'Community Tech Lab', '2026-04-18'),
  
  -- Green Earth Initiative projects
  (3, 'Tree Planting Initiative', 'Plant trees around the city to improve air quality and green spaces.', 'Various Locations', '2026-03-21'),
  (3, 'Recycling Education', 'Educate community members about proper recycling practices.', 'Community Center', '2026-03-29'),
  (3, 'River Cleanup', 'Clean up the local river and remove debris affecting wildlife.', 'River Park', '2026-04-03'),
  (3, 'Urban Garden Development', 'Develop sustainable urban gardens in underserved neighborhoods.', 'Downtown District', '2026-04-09'),
  (3, 'Composting Workshop', 'Teach community members how to compost and reduce waste.', 'Environmental Center', '2026-04-14')
ON CONFLICT DO NOTHING;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(255) NOT NULL UNIQUE
);

-- Project-categories junction table (many-to-many)
CREATE TABLE IF NOT EXISTS project_categories (
  project_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (project_id, category_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Sample data for categories
INSERT INTO categories (category_name)
VALUES
  ('Environmental'),
  ('Educational'),
  ('Community Service'),
  ('Health and Wellness'),
  ('Youth Development'),
  ('Technology'),
  ('Arts and Culture')
ON CONFLICT DO NOTHING;

-- Associate each project with at least one category
INSERT INTO project_categories (project_id, category_id)
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Park Cleanup Day' AND c.category_name = 'Environmental'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Park Cleanup Day' AND c.category_name = 'Community Service'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Food Bank Volunteer Day' AND c.category_name = 'Community Service'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Senior Center Visit' AND c.category_name = 'Health and Wellness'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Senior Center Visit' AND c.category_name = 'Community Service'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Community Garden Planting' AND c.category_name = 'Environmental'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Paint Local School' AND c.category_name = 'Community Service'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Paint Local School' AND c.category_name = 'Educational'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Beach Cleanup' AND c.category_name = 'Environmental'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Tutoring Program' AND c.category_name = 'Educational'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Tutoring Program' AND c.category_name = 'Youth Development'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Youth Sports Day' AND c.category_name = 'Youth Development'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Youth Sports Day' AND c.category_name = 'Health and Wellness'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'After School Mentoring' AND c.category_name = 'Educational'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'After School Mentoring' AND c.category_name = 'Youth Development'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Career Fair Planning' AND c.category_name = 'Educational'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Career Fair Planning' AND c.category_name = 'Youth Development'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Youth Art Workshop' AND c.category_name = 'Arts and Culture'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Youth Art Workshop' AND c.category_name = 'Youth Development'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Tech Skills Training' AND c.category_name = 'Technology'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Tech Skills Training' AND c.category_name = 'Youth Development'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Tree Planting Initiative' AND c.category_name = 'Environmental'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Recycling Education' AND c.category_name = 'Environmental'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Recycling Education' AND c.category_name = 'Educational'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'River Cleanup' AND c.category_name = 'Environmental'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Urban Garden Development' AND c.category_name = 'Environmental'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Urban Garden Development' AND c.category_name = 'Community Service'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Composting Workshop' AND c.category_name = 'Environmental'
UNION ALL
SELECT p.project_id, c.category_id FROM projects p, categories c WHERE p.title = 'Composting Workshop' AND c.category_name = 'Educational'
ON CONFLICT DO NOTHING;

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL,
  role_description TEXT
);

-- Insert initial roles
INSERT INTO roles (role_name, role_description) VALUES
  ('user', 'Standard user with basic access'),
  ('admin', 'Administrator with full system access')
ON CONFLICT DO NOTHING;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INTEGER REFERENCES roles(role_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User volunteers table (many-to-many: users <-> projects)
CREATE TABLE IF NOT EXISTS user_volunteers (
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  project_id INTEGER REFERENCES projects(project_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, project_id)
);
