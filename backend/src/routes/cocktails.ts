import { Router } from 'express';
import { createCocktail } from '../controllers/cocktails';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/', auth, createCocktail);

export default router;