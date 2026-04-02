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
  FOREIGN KEY (organization_id) REFERENCES organizations(organization_id)
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
