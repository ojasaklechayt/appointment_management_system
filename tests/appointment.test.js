const request = require('supertest');
const app = require('../app');
const { User } = require('../models/users');
const { Availability } = require('../models/availability');
const { Appointment } = require('../models/appointment');
const { sequelize } = require('../config/database');

describe('Appointment System end-to-end test', () => {
    let professorToken, student1Token, student2Token;
    let professorId, student1Id, student2Id;
    let availabilityId, appointmentId;

    beforeAll(async () => {
        await User.destroy({ where: {} });
        await Availability.destroy({ where: {} });
        await Appointment.destroy({ where: {} });

        const professorResponse = await request(app).post('/api/auth/register').send({
            username: 'prof_test',
            email: 'prof@test.com',
            password: 'password123',
            role: 'professor'
        });

        professorToken = professorResponse.body.token;
        professorId = professorResponse.body.id;

        const student1Response = await request(app).post('/api/auth/register').send({
            username: 'student1_test',
            email: 'student1@test.com',
            password: 'password123',
            role: 'student'
        });

        student1Token = student1Response.body.token;
        student1Id = student1Response.body.id;

        const student2Response = await request(app).post('/api/auth/register').send({
            username: 'student2_test',
            email: 'student2@test.com',
            password: 'password123',
            role: 'student'
        });

        student2Token = student2Response.body.token;
        student2Id = student2Response.body.id;
    });

    it('Professor sets availability', async () => {
        const response = (await request(app).post('/api/availability/set')).setEncoding('Authorization', `Bearer ${professorToken}`).send({
            startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
            endTime: new Date(Date.now() + 25 * 60 * 60 * 1000)
        });

        expect(response.statusCode).toBe(201);
        availabilityId = response.body.id;
    });

    it('Student1 books an appointment', async () => {
        const response = await request(app)
            .post('/api/appointments/book')
            .set('Authorization', `Bearer ${student1Token}`)
            .send({
                professorId,
                startTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000) // Tomorrow + 2 hours
            });

        expect(response.statusCode).toBe(201);
        appointmentId = response.body.id;
    });

    it('Student2 tries to book the same slot (should fail)', async () => {
        const response = await request(app)
            .post('/api/appointments/book')
            .set('Authorization', `Bearer ${student2Token}`)
            .send({
                professorId,
                startTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
            });

        expect(response.statusCode).toBe(400);
    });

    it('Professor cancels Student1 appointment', async () => {
        const response = await request(app)
            .patch(`/api/appointments/${appointmentId}/cancel`)
            .set('Authorization', `Bearer ${professorToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('cancelled');
    });

    it('Student1 checks appointments (should be none)', async () => {
        const response = await request(app)
            .get('/api/appointments/student')
            .set('Authorization', `Bearer ${student1Token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });


    afterAll(async () => {
        await sequelize.close();
    });
});