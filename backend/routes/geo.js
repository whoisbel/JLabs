import { Router } from 'express';
import {
  getOwnGeoInfo,
  getGeoByIP,
  clearSearchHistory,
  getSearchHistory,
  deleteMultipleHistory
} from '../controller/geoController.js';
import { authenticateToken } from '../utils/authorize.js';

const geoRouter = Router();

geoRouter.post('/geo', authenticateToken, getOwnGeoInfo);
geoRouter.post('/geo/search', authenticateToken, getGeoByIP);
geoRouter.get('/geo/history', authenticateToken, getSearchHistory);
geoRouter.delete('/geo/history/multiple', authenticateToken, deleteMultipleHistory);
export default geoRouter;
