import { Router } from 'express';
import {createCocktail, getCocktails, getMyCocktails} from '../controllers/cocktails';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/my', auth, getMyCocktails);
router.get('/', auth, getCocktails);
router.post('/', auth, createCocktail);

export default router;