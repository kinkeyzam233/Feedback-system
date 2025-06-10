// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/feedback', userController.showFeedbackForm);
router.post('/feedback', userController.submitFeedback);
router.get('/my-feedback', userController.viewMyFeedback);
router.post('/my-feedback/delete/:id', userController.deleteFeedback);

module.exports = router;