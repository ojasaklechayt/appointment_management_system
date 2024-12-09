const { Appointment, Availability, User } = require('../models');
const { Op } = require('sequelize');
const { sequilize } = require('../config/database');

exports.bookAppointment = async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(401).json({ message: 'You are not authorized to book an appointment' });
        }

        const { professorId, startTime, endTime, day } = req.body;

        // Ensure the day is valid and matches one of the professor's available days
        if (!['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(day)) {
            return res.status(400).json({ message: 'Invalid day provided.' });
        }

        // Log the input values for debugging purposes
        console.log("Start Time:", startTime);
        console.log("End Time:", endTime);

        // Check if the professor has availability for the given day, start time, and end time
        const availability = await Availability.findOne({
            where: {
                professorId,
                day,
                startTime: { [Op.lte]: startTime },
                endTime: { [Op.gte]: endTime }
            }
        });

        console.log("Here are the available time slots : ", availability);

        if (!availability) {
            return res.status(404).json({ message: 'No availability found for the given professor on this day and time.' });
        }

        // Check if there is an existing appointment that overlaps with the requested time slot
        const existingAppointment = await Appointment.findOne({
            where: {
                professorId,
                startTime: { [Op.lte]: startTime },
                endTime: { [Op.gte]: endTime },
                status: { [Op.ne]: 'cancelled' }
            }
        });

        if (existingAppointment) {
            return res.status(400).json({ error: 'Slot already booked for this time.' });
        }

        // Create the appointment if no conflicts
        const appointment = await Appointment.create({
            studentId: req.user.id,
            professorId,
            startTime: startTime,   // Ensure startTime is a Date object
            endTime: endTime,       // Ensure endTime is a Date object
            day,
            availabilityId: availability.id,  // Set availabilityId from the found availability
            status: 'confirmed',
        });

        res.status(201).json(appointment);
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
};

exports.cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findOne({
            where: { id }
        });

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        
        console.log(appointment.professorId);
        console.log(req.user.id);

        if (req.user.role !== 'professor' || appointment.professorId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to cancel this appointment' });
        }

        // Update the appointment status
        appointment.status = 'cancelled';
        await appointment.save();  // Save the changes directly

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStudentAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            where: {
                studentId: req.user.id,
                status: { [Op.ne]: 'cancelled' }
            },
            include: [
                {
                    model: User,
                    as: 'Professor',
                    attributes: ['username', 'email']
                }
            ]
        });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProfessorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            where: {
                professorId: req.user.id,
                status: { [Op.ne]: 'cancelled' }
            },
            include: [
                {
                    model: User,
                    as: 'Student',
                    attributes: ['username', 'email']
                }
            ]
        });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
