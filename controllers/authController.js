const bcrypt = require('bcrypt');
const db = require('../config/db');
require('dotenv').config();

// Render login page
const getLogin = (req, res) => {
  res.render('pages/login', {
    message: req.flash('error')[0] || null,
  });
};
// Handle login POST (admin & students)
const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Logging input and env values for debugging
    console.log("Login attempt:", email);
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    console.log("Configured Admin Email:", adminEmail);
    console.log("Configured Admin Password:", adminPassword); // In production, avoid logging passwords

    // Admin login logic
    if (email === adminEmail) {
      if (password === adminPassword) {
        console.log("Admin login successful");
        req.session.user = {
          id: 'admin',
          email: adminEmail,
          name: 'Admin',
          role: 'admin'
        };
        req.session.isLoggedIn = true;
        req.flash('success', 'Welcome Admin!');
        return res.redirect('/admin/landing_admin');
      } else {
        console.log("Admin password mismatch");
        req.flash('error', 'Invalid admin credentials.');
        return res.redirect('/login');
      }
    }

    // Student login logic
    const student = await db.oneOrNone('SELECT * FROM students WHERE email = $1', [email]);
    if (!student) {
      console.log("Student not found");
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      console.log("Incorrect student password");
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    req.session.user = {
      id: student.id,
      email: student.email,
      name: student.name,
      role: 'student'
    };
    req.session.isLoggedIn = true;
    req.flash('success', 'Login successful');
    console.log("Student login successful");
    res.redirect('/user/home');

  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'Something went wrong');
    res.redirect('/login');
  }
};

// Render register page
const getRegister = (req, res) => {
  res.render('pages/register', { formData: req.body || {} }
};

// Handle registration POST (students only)
const postRegister = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.none('INSERT INTO students(name, email, password) VALUES($1, $2, $3)', [
      name, email, hashedPassword
    ]);
    req.flash('success', 'Registration successful. Please log in.');
    res.redirect('/login');
  } catch (error) {
    console.error('Registration error:', error);
    req.flash('error', 'Registration failed');
    res.redirect('/register');
  }
};

// Render reset password page
const getResetPassword = (req, res) => {
  res.render('pages/reset-password');
};

// Handle password reset (placeholder)
const postResetPassword = (req, res) => {
  req.flash('info', 'Password reset feature coming soon.');
  res.redirect('/login');
};

// Logout
const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};

module.exports = {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  getResetPassword,
  postResetPassword,
  logout
};
