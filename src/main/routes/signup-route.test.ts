import request from 'supertest'
import app from '../config/app'
describe('Signup Route', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'valid_password',
        confirmationPassword: 'valid_password'
      })
      .expect(200)
  })
})
