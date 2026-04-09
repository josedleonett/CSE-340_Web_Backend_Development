import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';

const SALT_ROUNDS = 10;

export const showUserRegistrationForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

export const processUserRegistrationForm = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await createUser(name, email, passwordHash);
    req.flash('success', 'Account created! Please log in.');
    res.redirect('/login');
  } catch (error) {
    console.error('Registration error:', error);
    req.flash('error', 'Registration failed. The email may already be in use.');
    res.redirect('/register');
  }
};

export const showLoginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

export const processLoginForm = async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticateUser(email, password);
  if (user) {
    req.session.user = user;
    req.flash('success', 'Login successful!');
    console.log('Logged in user:', user);
    res.redirect('/dashboard');
  } else {
    req.flash('error', 'Invalid email or password.');
    res.redirect('/login');
  }
};

export const processLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect('/login');
  });
};

export const requireLogin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash('error', 'You must be logged in to view that page.');
    return res.redirect('/login');
  }
  next();
};

export const showDashboard = (req, res) => {
  const { name, email, role_name } = req.session.user;
  res.render('dashboard', { title: 'Dashboard', name, email, role_name });
};

export const showUsersPage = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.render('users', { title: 'Users', users });
  } catch (error) {
    console.error('Error fetching users:', error);
    req.flash('error', 'Failed to load users.');
    res.redirect('/dashboard');
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role_name === role) {
      return next();
    }
    req.flash('error', 'You do not have permission to access that page.');
    res.redirect('/');
  };
};
