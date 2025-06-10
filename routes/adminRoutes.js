const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware'); // if you have admin auth middleware

// Admin dashboard - protected route
router.get('/landing_admin', authMiddleware.isAdmin, adminController.getDashboard);
router.get('/feedbacks', authMiddleware.isAdmin, adminController.viewAllFeedback);
router.post('/logout', authMiddleware.isAdmin, adminController.postLogout);
router.get('/landing_admin', (req, res) => {
  res.render('admin/landing_admin'); // Or just res.send('Admin Home')
});
module.exports = router;
