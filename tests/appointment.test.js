const request = require('supertest');
const app = require('../app');
const { User, Availability, Appointment } = require('../models');
const { sequelize } = require('../config/database');

describe('Appointment System end-to-end test', () => {
    let professorToken, student1Token, student2Token;
    let professorId, student1Id, student2Id;
    let availabilityId, appointmentId;

    beforeAll(async () => {
        // Clear existing data
        await User.destroy({ where: {} });
        await Availability.destroy({ where: {} });
        await Appointment.destroy({ where: {} });

        // Register professor with dynamic data
        const professorResponse = await request(app)
            .post('/api/auth/register')
            .send({
                firstName: 'Prof',
                lastName: 'Test',
                username: `prof_test_${Date.now()}`,
                email: `prof_${Date.now()}@test.com`,
                password: 'password123',
                role: 'professor',
            });

        professorToken = professorResponse.body.accessToken;
        professorId = professorResponse.body.user.id;

        // Register Student 1 with dynamic data
        const student1Response = await request(app)
            .post('/api/auth/register')
            .send({
                firstName: 'Student1',
                lastName: 'Test',
                username: `student1_test_${Date.now()}`,
                email: `student1_${Date.now()}@test.com`,
                password: 'password123',
                role: 'student',
            });

        student1Token = student1Response.body.accessToken;
        student1Id = student1Response.body.user.id;

        // Register Student 2 with dynamic data
        const student2Response = await request(app)
            .post('/api/auth/register')
            .send({
                firstName: 'Student2',
                lastName: 'Test',
                username: `student2_test_${Date.now()}`,
                email: `student2_${Date.now()}@test.com`,
                password: 'password123',
                role: 'student',
            });

        student2Token = student2Response.body.accessToken;
        student2Id = student2Response.body.user.id;
    });

    it('Professor sets availability', async () => {
        const response = await request(app)
            .post('/api/availability/set')
            .set('Authorization', `Bearer ${professorToken}`)
            .send({
                day: 'Monday',
                startTime: '10:00:00',
                endTime: '11:00:00',
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
                startTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // Tomorrow + 2 hours
                endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // Tomorrow + 3 hours
                day: 'Monday'
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
                startTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // Same slot as Student1
                endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // Same slot as Student1
                day: 'Monday'
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

    it('Student2 checks appointments (should be none)', async () => {
        const response = await request(app)
            .get('/api/appointments/student')
            .set('Authorization', `Bearer ${student2Token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });

    afterAll(async () => {
        await sequelize.close();
    });
});
