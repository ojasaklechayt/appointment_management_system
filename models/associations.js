const Appointment = require('./appointment');
const User = require('./user');

const setupAssociations = () => {
    User.hasMany(Appointment, { foreignKey: 'studentId', as: 'StudentAppointments' });
    User.hasMany(Appointment, { foreignKey: 'professorId', as: 'ProfessorAppointments' });
    Appointment.belongsTo(User, { foreignKey: 'studentId', as: 'Student' });
    Appointment.belongsTo(User, { foreignKey: 'professorId', as: 'Professor' });
};

module.exports = setupAssociations;

