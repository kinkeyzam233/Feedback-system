// Sample feedback data (replace with DB fetch later)
const feedbackData = [
  {
    date: '2024-01-20',
    feedback: 'The user interface is confusing',
    sentiment: 'negative',
    status: 'new',
    id: 1
  },
  {
    date: '2024-01-18',
    feedback: 'Love the recent updates!',
    sentiment: 'positive',
    status: 'reviewed',
    id: 2
  },
  {
    date: '2024-01-18',
    feedback: 'Loading times could be improved',
    sentiment: 'neutral',
    status: 'new',
    id: 3
  }
];

// Render admin landing page (dashboard)
const getDashboard = (req, res) => {
  res.render('admin/dashboard', {
    adminName: req.session.user?.name || 'Admin',
    feedbackData
  });
};

// Render feedback listing page
const viewAllFeedback = (req, res) => {
  res.render('admin/list', {
    adminName: req.session.user?.name || 'Admin',
    feedbacks: feedbackData
  });
};

// Admin logout handler
const postLogout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.redirect('/admin/landing_admin');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};

module.exports = {
  getDashboard,
  viewAllFeedback,
  postLogout
};
