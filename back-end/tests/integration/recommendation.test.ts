import supertest from 'supertest';
import app from '../../src/app.js';
import { faker } from '@faker-js/faker';
import { prisma } from '../../src/database.js';

describe('Testing POST /recommendations', () => {
  const recommendation = {
    name: faker.internet.userName(),
    youtubeLink: 'https://www.youtube.com/watch?v=fmI_Ndrxy14',
  };

  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Should return 201 when create a recommendation', async () => {
    const data = await supertest(app)
      .post('/recommendations')
      .send(recommendation);

    expect(data.status).toBe(201);
  });

  it('Should return 409 when create a duplicate recommendation', async () => {
    await supertest(app).post('/recommendations').send(recommendation);
    const data = await supertest(app)
      .post('/recommendations')
      .send(recommendation);

    expect(data.status).toBe(409);
  });

  it('Should return 422 when create a recommendation without name', async () => {
    const data = await supertest(app)
      .post('/recommendations')
      .send(recommendation.youtubeLink);

    expect(data.status).toBe(422);
  });

  it('Should return 422 when create a recommendation without youtubeLink', async () => {
    const data = await supertest(app)
      .post('/recommendations')
      .send(recommendation.name);

    expect(data.status).toBe(422);
  });
});
