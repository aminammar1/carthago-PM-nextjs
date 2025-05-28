import request from 'supertest'
import app from '../../index'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('User Controller', () => {
  let userId: number
  let token: string

  beforeAll(async () => {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'testpassword',
      },
    })
    userId = user.userId
    // Simulate login to get token (replace with your actual login route if needed)
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'testpassword' })
    token = res.body.token
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'testuser@example.com' } })
    await prisma.$disconnect()
  })

  it('should update user info', async () => {
    const res = await request(app)
      .patch(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'updateduser', email: 'updateduser@example.com' })
    expect(res.status).toBe(200)
    expect(res.body.username).toBe('updateduser')
    expect(res.body.email).toBe('updateduser@example.com')
  })

  it('should get all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('should get authenticated user', async () => {
    const res = await request(app)
      .post('/api/users/authenticated')
      .set('Cookie', [`jwt=${token}`])
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('userId')
  })
})
