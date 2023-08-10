import express from 'express';
import { authRouter } from './auth.router.js';
import { swaggerDoc } from '../config/api-doc.config.js';
import swaggerUi from 'swagger-ui-express';
import { appRouter } from './app.router.js';


const router = express.Router();

router.use('/auth', authRouter);
router.use('/app', appRouter);
router.use('/', 
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc)  
)

export const API = router;