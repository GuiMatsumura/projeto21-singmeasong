import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { recommendationRepository } from '../../../src/repositories/recommendationRepository.js';
import { recommendationService } from '../../../src/services/recommendationsService.js';
import { conflictError, notFoundError } from '../../../src/utils/errorUtils';

describe('Test recommendation service', () => {
  const recommendation = {
    name: faker.internet.userName(),
    youtubeLink: 'https://www.youtube.com/watch?v=fmI_Ndrxy14',
  };
  it('Should create a recommendation', async () => {
    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockImplementationOnce((): any => {});

    jest
      .spyOn(recommendationRepository, 'create')
      .mockImplementationOnce((): any => {});

    await recommendationService.insert(recommendation);

    expect(recommendationRepository.findByName).toBeCalledTimes(1);
    expect(recommendationRepository.create).toBeCalledTimes(1);
  });

  it('Should not create a duplicate recommendation', async () => {
    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockImplementationOnce((): any => {
        return {
          recommendation,
        };
      });

    const insert = recommendationService.insert(recommendation);

    expect(insert).rejects.toEqual(
      conflictError('Recommendations names must be unique')
    );
  });

  it('Should upvote a recommendation', async () => {
    jest
      .spyOn(recommendationRepository, 'find')
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          score: 0,
          ...recommendation,
        };
      });

    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockImplementationOnce((): any => {
        return {};
      });

    await recommendationService.upvote(1);

    expect(recommendationRepository.updateScore).toBeCalledTimes(1);
    expect(recommendationRepository.find).toBeCalledTimes(1);
  });

  it('Should not upvote a recommendation who not exist', async () => {
    jest
      .spyOn(recommendationRepository, 'find')
      .mockImplementationOnce((): any => {});

    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockImplementationOnce((): any => {});

    const insert = recommendationService.upvote(0);

    expect(insert).rejects.toEqual(notFoundError(''));
  });

  it('Should downvote a recommendation', async () => {
    jest
      .spyOn(recommendationRepository, 'find')
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          score: 0,
          ...recommendation,
        };
      });

    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockImplementationOnce((): any => {
        return {};
      });

    await recommendationService.downvote(1);

    expect(recommendationRepository.updateScore).toBeCalledTimes(1);
    expect(recommendationRepository.find).toBeCalledTimes(1);
  });

  it("Shouldn't downvote a recommendation that doesn't exist", async () => {
    jest
      .spyOn(recommendationRepository, 'find')
      .mockImplementationOnce((): any => {});

    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockImplementationOnce((): any => {});

    const insert = recommendationService.downvote(1);

    expect(insert).rejects.toEqual(notFoundError(''));
  });
});
