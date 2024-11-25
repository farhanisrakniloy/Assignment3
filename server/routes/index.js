const express = require('express');
const router = express.Router();

// Homepage route
router.get('/', (req, res) => {
  res.render('index', { title: 'Book Library Management' });
});

module.exports = router;