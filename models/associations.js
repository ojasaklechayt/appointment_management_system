const { User, Availability, Appointment } = require('./index');

function setupAssociations() {
    // User Associations
    User.hasMany(Availability, {
        foreignKey: 'professorId',
        as: 'ProfessorAvailability'
    });

    User.hasMany(Appointment, {
        foreignKey: 'studentId',
        as: 'StudentAppointments'
    });

    User.hasMany(Appointment, {
        foreignKey: 'professorId',
        as: 'ProfessorAppointments'
    });

    // Availability Associations
    Availability.belongsTo(User, {
        foreignKey: 'professorId',
        as: 'Professor'
    });

    Availability.hasMany(Appointment, {
        foreignKey: 'availabilityId',
        as: 'AvailabilityAppointments'
    });

    // Appointment Associations
    Appointment.belongsTo(User, {
        foreignKey: 'studentId',
        as: 'Student'
    });

    Appointment.belongsTo(User, {
        foreignKey: 'professorId',
        as: 'Professor'
    });

    Appointment.belongsTo(Availability, {
        foreignKey: 'availabilityId',
        as: 'Availability'
    });
}

module.exports = setupAssociations;