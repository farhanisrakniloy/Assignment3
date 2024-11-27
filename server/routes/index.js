const express = require('express');
const router = express.Router();

// Homepage route
router.get('/', (req, res) => {
  const msg = req.query.msg || ''; // Example: Get msg from query parameters or set default
  res.render('index', { msg, user: req.user, popularBooks: [], recentBooks: [] }); // Pass msg to the view
});

module.exports = router;