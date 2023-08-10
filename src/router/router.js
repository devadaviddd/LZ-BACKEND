import express from 'express';
import { authRouter } from './auth.router.js';
import { swaggerDoc } from '../config/api-doc.config.js';
import swaggerUi from 'swagger-ui-express';
import { adminRouter } from './admin.router.js';


const router = express.Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/', 
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc)  
)

export const API = router;  