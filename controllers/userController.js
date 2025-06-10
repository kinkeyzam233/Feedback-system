const { 
  addFeedback, 
  getFeedbackByStudentId, 
  deleteFeedback 
} = require('../models/feedbackModel');
const db = require('../config/db');

// Hardcoded options for feedback form
const courseOptions = [
  { id: 1, name: 'Web Development' },
  { id: 2, name: 'Data Structures' },
  { id: 3, name: 'Operating Systems' }
];

const moduleOptions = [
  { id: 1, name: 'HTML/CSS' },
  { id: 2, name: 'JavaScript' },
  { id: 3, name: 'Node.js' }
];

const categoryOptions = [
  { id: 1, name: 'Quality' },
  { id: 2, name: 'Difficulty' },
  { id: 3, name: 'Teaching' }
];

// Show feedback form
exports.showFeedbackForm = async (req, res) => {
  try {
    res.render('user/feedback', {
      user: req.session.user,
      courseOptions,
      moduleOptions,
      categories: categoryOptions,
      message: req.flash('success')[0] || null,
      error: req.flash('error')[0] || null,
      formData: {}
    });
  } catch (error) {
    console.error('Error loading feedback form:', error);
    res.render('user/feedback', {
      user: req.session.user,
      courseOptions,
      moduleOptions,
      categories: categoryOptions,
      message: null,
      error: 'Failed to load feedback form.',
      formData: {}
    });
  }
};

// Submit feedback
exports.submitFeedback = async (req, res) => {
  const {
    course_id, instructor_id, category_id, rating,
    comments, is_anonymous, semester, academic_year
  } = req.body;

  const formData = {
    course_id,
    instructor_id,
    category_id,
    rating,
    comments,
    is_anonymous,
    semester,
    academic_year
  };

  try {
    const student_id = req.session.user.id;
    const student_name = req.session.user.name;

    await addFeedback({
      student_id,
      course_id,
      instructor_id,
      category_id,
      rating: parseInt(rating),
      comments,
      is_anonymous: is_anonymous === 'true' || is_anonymous === true,
      semester,
      academic_year,
      student_name: is_anonymous === 'true' ? 'Anonymous Student' : student_name
    });

    req.flash('success', 'Feedback submitted successfully!');
    res.redirect('/user/feedback');
  } catch (error) {
    console.error('Error submitting feedback:', error);

    req.flash('error', 'Failed to submit feedback. Please try again.');
    res.render('user/feedback', {
      user: req.session.user,
      courseOptions,
      moduleOptions,
      categories: categoryOptions,
      message: null,
      error: req.flash('error')[0],
      formData
    });
  }
};

// View logged in user's feedback
exports.viewMyFeedback = async (req, res) => {
  try {
    const studentId = req.session.user?.id;

    if (!studentId) {
      return res.redirect('/login'); // or /user/login depending on route
    }

    // You can use a model function here instead of raw query:
    // const feedbacks = await getFeedbackByStudentId(studentId);
    const feedbacks = await db.any(
      `SELECT id, created_at, course, module, rating, feedback_message, is_anonymous
       FROM feedback WHERE student_id = $1 ORDER BY created_at DESC`,
      [studentId]
    );

    res.render('user/my-feedback', { // adjust path according to your views
      user: req.session.user,
      feedbacks,
      message: req.flash('success')[0] || null,
      error: req.flash('error')[0] || null
    });
  } catch (error) {
    console.error('Error loading user feedback:', error);
    res.render('user/my-feedback', { feedbacks: [], error: 'Failed to load your feedback.' });
  }
};

// Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteFeedback(id);
    req.flash('success', 'Feedback deleted successfully!');
  } catch (error) {
    console.error('Error deleting feedback:', error);
    req.flash('error', 'Failed to delete feedback.');
  }
  res.redirect('/user/my-feedback');
};
