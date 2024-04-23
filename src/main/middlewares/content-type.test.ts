import request from 'supertest'
import app from '../config/app'
describe('Content-Type Middleware', () => {
  test('Should return default content-type JSON', async () => {
    app.get('/test_content-type', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test_content-type')
      .expect('content-type', /json/)
  })

  test('Should return xml type when FORCED', async () => {
    app.get('/test_content-type_xml', (req, res) => {
      res.type('xml')
      res.send()
    })
    await request(app)
      .get('/test_content-type_xml')
      .expect('content-type', /xml/)
  })
})
