const { Availability, User } = require('../models');
const { Op } = require('sequelize');

exports.setAvailability = async (req, res) => {
    try {
        if (req.user.role !== 'professor') {
            return res.status(403).json({ error: 'Only professors can set availability' });
        }

        const { startTime, endTime, day } = req.body;

        // Ensure day is provided and valid
        if (!day || !['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(day)) {
            return res.status(400).json({ error: 'Invalid or missing day. Must be one of the days of the week.' });
        }

        // Ensure startTime and endTime are in a valid HH:mm:ss format
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
        if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
            return res.status(400).json({ error: 'Invalid time format. Expected HH:mm:ss.' });
        }

        // Compare times as strings or by converting to Date objects
        const startDate = new Date(`1970-01-01T${startTime}Z`);
        const endDate = new Date(`1970-01-01T${endTime}Z`);

        if (startDate >= endDate) {
            return res.status(400).json({ error: 'Start time must be before end time.' });
        }

        const existingAvailability = await Availability.findOne({
            where: {
                professorId: req.user.id,
                day: day,
                [Op.or]: [
                    {
                        startTime: {
                            [Op.between]: [startDate, endDate]
                        }
                    },
                    {
                        endTime: {
                            [Op.between]: [startDate, endDate]
                        }
                    }
                ]
            }
        });

        if (existingAvailability) {
            return res.status(400).json({ error: 'Availability slot overlaps with an existing slot.' });
        }

        const availability = await Availability.create({
            professorId: req.user.id,
            startTime,
            endTime,
            day
        });

        res.status(201).json(availability);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getProfessorAvailability = async (req, res) => {
    try {
        const { professorId } = req.params;
        const availabilities = await Availability.findAll({
            where: {
                professorId,
                startTime: { [Op.gt]: new Date() }
            },
            include: [{
                model: User,
                as: 'Professor',
                attributes: ['username', 'email']
            }]
        });

        res.json(availabilities);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}