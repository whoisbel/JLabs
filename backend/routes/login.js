import { Router } from 'express';
import loginController from '../controller/loginController.js';

const loginRouter = Router();

loginRouter.post('/login', loginController);

export default loginRouter;
