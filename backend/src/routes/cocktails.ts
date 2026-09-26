import { Router } from 'express';
import {createCocktail, deleteCocktail, getCocktail, getCocktails, getMyCocktails} from '../controllers/cocktails';
import { auth } from '../middleware/auth';
import { uploadCocktailImage } from '../middleware/upload';

const router = Router();

router.get('/my', auth, getMyCocktails);
router.get('/', auth, getCocktails);
router.get('/:id', auth, getCocktail);
router.post('/', auth, uploadCocktailImage.single('image'), createCocktail);
router.delete('/:id', auth, deleteCocktail);

export default router;