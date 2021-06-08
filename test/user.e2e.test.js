const request = require('supertest');
require('dotenv').config();
const app=require('../app.js')
const { newUser, TestUser } = require('./data/data');
const db = require('../model/db')
const User = require('../model/schemas/user');
const fs = require('fs/promises');


describe('e2e testing users avatar route', () => {
  let token;

  beforeAll(async () => {
  await db;
  await User.deleteOne({ email: newUser.email });
  
  })
  
  afterAll(async () => {
  const mongo = await db;
    await User.deleteOne({ email: newUser.email });
    await mongo.disconnect()
  })

  it('should response 201 for registration user', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send(newUser)
    
    expect(res.status).toEqual(201)
    expect(res.body).toBeDefined()
  })

  it('should response 409 for registration user', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send(newUser)
    
    expect(res.status).toEqual(409)
    expect(res.body).toBeDefined()
  })

  it('should response 200 for login user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send(newUser)
    
    expect(res.status).toEqual(200)
    expect(res.body).toBeDefined()
    token=res.body.data.token
  })

  it('should response 401 for login user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send(TestUser)
    
    expect(res.status).toEqual(401)
    expect(res.body).toBeDefined()
    
  })
  
     it('should response 200 status for patch users/avatars', async () => {
     const buf=await fs.readFile('./test/data/1.jpeg')
      const res = await request(app)
      .patch('/api/users/avatars')
      .set('Authorization', `Bearer ${token}`)
      .attach('avatarURL', buf, '1.jpeg')
              
    expect(res.status).toEqual(200)
    expect(res.body.data.avatarUrl).toBeDefined()
    })
  
});


