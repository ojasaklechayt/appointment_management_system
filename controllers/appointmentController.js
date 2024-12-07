const { Appointment } = require('../models/appointment');
const { User } = require('../models/users');
const { Availability } = require('../models/availability');
const { Op, where } = require('sequelize');
const { sequilize } = require('../config/database');

exports.bookAppointment = async (req, res) => {
    const transaction = await sequilize.transaction();
    try {
        if (req.user.role !== 'student') {
            return res.status(401).json({ message: 'You are not authorized to book an appointment' });
        }

        const { professorId, startTime } = req.body;

        const availability = await Availability.findOne({
            where: {
                professorId,
                startTime: { [Op.lte]: startTime },
                endTime: { [Op.gte]: startTime }
            },
            transaction
        });

        if (!availability) {
            await transaction.rollback();
            return res.status(404).json({ message: 'No availability found for the given professor' });
        }

        const existingAppointment = await Appointment.findOne({
            where: {
                professorId,
                startTime,
                status: { [Op.ne]: 'cancelled' }
            },
            transaction
        });

        if (existingAppointment) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Slot Already Booked' });
        }

        const appointment = await Appointment.create({
            studentId: req.user.id,
            professorId,
            startTime,
            status: 'pending',
        }, { transaction });

        await transaction.commit();
        res.status(201).json(appointment);
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
};


exports.cancelAppointment = async (req, res) => {
    const transaction = await sequilize.transaction();

    try {
        const { id } = req.params;
        const appointment = await Appointment.findByPk(id, { transaction });

        if (!appointment) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Appointment not found' });
        }

        if (res.user.role !== 'professor' || appointment.professorId != req.user.id) {
            await transaction.rollback();
            return res.status(403).json({ error: 'Unsuthorized to cancel this appointment' });
        }

        appointment.status = 'cancelled';
        await appointment.save({ transaction });

        await transaction.commit();
        res.json(appointment);
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
}

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

exports.getProfessorAppointments = async (req,res) => {
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
