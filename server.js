import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import session from 'express-session';
import flash from './src/middleware/flash.js';
import router from './src/controllers/routes.js';

dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'cse340-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 }
}));

app.use(flash);

app.use(express.static(path.join(__dirname, 'public')));

app.use(router);

app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.error('Error occurred:', err.message);
  const status = err.status || 500;
  res.status(status).render('index', { title: 'Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
