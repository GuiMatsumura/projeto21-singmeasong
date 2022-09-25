import { Request, Response } from 'express';
import { recommendationService } from '../services/recommendationsService.js';

async function resetRecommendationTable(req: Request, res: Response) {
  await recommendationService.resetRecommendation();
  res.sendStatus(200);
}

export default {
  resetRecommendationTable,
};
