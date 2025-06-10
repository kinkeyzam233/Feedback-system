const { db } = require('../config/db'); // ✅ Destructure `db` from the object

// Get all feedback (with optional filters)
const getFeedback = async (filter = {}) => {
  let query = 'SELECT * FROM feedback WHERE 1=1';
  const values = [];

  if (filter.course_id) {
    values.push(filter.course_id);
    query += ` AND course_id = $${values.length}`;
  }

  if (filter.semester) {
    values.push(filter.semester);
    query += ` AND semester = $${values.length}`;
  }

  if (filter.academic_year) {
    values.push(filter.academic_year);
    query += ` AND academic_year = $${values.length}`;
  }

  if (filter.student_id) {
    values.push(filter.student_id);
    query += ` AND student_id = $${values.length}`;
  }

  if (!filter.isAdmin) {
    // Only show limited info if not admin
    query = `
      SELECT 
        id,
        course_id,
        rating,
        CASE 
          WHEN is_anonymous THEN 'Anonymous Student'
          ELSE student_name
        END as student_name,
        comments,
        created_at
      FROM feedback
      WHERE 1=1
    `;
    if (filter.course_id) {
      query += ` AND course_id = $1`;
    }
    if (filter.student_id) {
      query += ` AND student_id = $2`;
    }
  }

  return db.any(query, values);
};

// Add new feedback
const addFeedback = async (data) => {
  const {
    student_id, course_id, instructor_id,
    category_id, rating, comments, is_anonymous = true,
    semester, academic_year, student_name
  } = data;

  const query = `
    INSERT INTO feedback (
      student_id, course_id, instructor_id,
      category_id, rating, comments, is_anonymous,
      semester, academic_year, student_name
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *
  `;

  const values = [
    student_id, course_id, instructor_id,
    category_id, rating, comments, is_anonymous,
    semester, academic_year,
    is_anonymous ? 'Anonymous Student' : student_name
  ];

  return db.one(query, values);
};

// Delete feedback by ID
const deleteFeedback = async (id) => {
  return db.none('DELETE FROM feedback WHERE id = $1', [id]);
};

// Get all feedback categories
const getCategories = async () => {
  return db.any('SELECT id, name FROM feedback_categories ORDER BY name');
};

// Get all available courses (for dropdown)
const getCourses = async () => {
  return db.any('SELECT id, name FROM courses ORDER BY name');
};

// Get all available modules (for dropdown)
const getModules = async () => {
  return db.any('SELECT id, name FROM modules ORDER BY name');
};

module.exports = {
  getFeedback,
  addFeedback,
  deleteFeedback,
  getCategories,
  getCourses,
  getModules
};
