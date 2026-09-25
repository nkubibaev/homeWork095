import { Router } from 'express';
import {createCocktail, deleteCocktail, getCocktail, getCocktails, getMyCocktails} from '../controllers/cocktails';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/my', auth, getMyCocktails);
router.get('/', auth, getCocktails);
router.get('/:id', auth, getCocktail);
router.post('/', auth, createCocktail);
router.delete('/:id', auth, deleteCocktail);

export default router;