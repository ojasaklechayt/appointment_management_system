const express = require('express');
const { setAvailability, getProfessorAvailability } = require('../controllers/availabilityController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/set', authMiddleware, setAvailability);
router.get('/professor/:professorId', getProfessorAvailability);

module.exports = router;

