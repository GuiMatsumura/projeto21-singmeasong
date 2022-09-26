import supertest from 'supertest';
import app from '../../src/app.js';
import { faker } from '@faker-js/faker';
import { prisma } from '../../src/database.js';
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';

const recommendation = {
  name: faker.internet.userName(),
  youtubeLink: 'https://www.youtube.com/watch?v=fmI_Ndrxy14',
};

describe('Testing POST /recommendations', () => {
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

describe('Testing POST /recommendations/:id/upvote', () => {
  it('Should return 200 the id is correct', async () => {
    await supertest(app).post('/recommendations').send(recommendation);
    const { id } = await recommendationRepository.findByName(
      recommendation.name
    );
    const data = await supertest(app).post(`/recommendations/${id}/upvote`);

    expect(data.status).toBe(200);
  });

  it('Should return 404 the id is incorrect', async () => {
    const id = 0;

    const data = await supertest(app).post(`/recommendations/${id}/upvote`);

    expect(data.status).toBe(404);
  });
});

describe('Testing POST /recommendations/:id/downvote', () => {
  it('Should return 200 the id is correct', async () => {
    await supertest(app).post('/recommendations').send(recommendation);
    const { id } = await recommendationRepository.findByName(
      recommendation.name
    );
    const data = await supertest(app).post(`/recommendations/${id}/downvote`);

    expect(data.status).toBe(200);
  });

  it('Should return 404 the id is incorrect', async () => {
    const id = 0;

    const data = await supertest(app).post(`/recommendations/${id}/downvote`);

    expect(data.status).toBe(404);
  });
});
