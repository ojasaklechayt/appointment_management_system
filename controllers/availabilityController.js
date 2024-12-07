const { Availability } = require('../models/appointment');
const { User } = require('../models/users');

const { Op } = require('sequelize');

exports.setAvailability = async (req, res) => {
    try {
        if (req.user.role !== 'professor') {
            return res.status(403).json({ error: 'Only professors can set availability' });
        }

        const { startTime, endTime } = req.body;

        if (new Date(startTime) >= new Date(endTime)) {
            return res.status(400).json({ error: 'Invalid time slot' });
        }

        const existingAvailability = await Availability.findOne({
            where: {
                professorId: req.user.id,
                [Op.or]: [
                    {
                        startTime: {
                            [Op.between]: [startTime, endTime]
                        }
                    },
                    {
                        endTime: {
                            [Op.between]: [startTime, endTime]
                        }
                    }
                ]
            }
        });

        if (existingAvailability) {
            return res.status(400).json({ error: 'Availability slot overlaps with existing slot' });
        }

        const availability = await Availability.create({
            professorId: req.user.id,
            startTime,
            endTime
        });

        res.status(201).json(availability);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProfessorAvailability = async (req,res) => {
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
        res.status(500).json({ error: error.message });
    }
}