const express = require('express');
const { bookAppointment, cancelAppointment, getStudentAppointments, getProfessorAppointments } = require('../controllers/appointmentController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/book', authMiddleware, bookAppointment);
router.get('/student', authMiddleware, getStudentAppointments);
router.get('/professor', authMiddleware, getProfessorAppointments);
router.patch('/:id/cancel', authMiddleware, cancelAppointment);

module.exports = router;