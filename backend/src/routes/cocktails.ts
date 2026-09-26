import { Router } from 'express';
import {
    createCocktail,
    deleteCocktail,
    getCocktail,
    getCocktails,
    getMyCocktails,
    getUnpublishedCocktails,
    publishCocktail,
    rateCocktail,
} from '../controllers/cocktails';
import { auth } from '../middleware/auth';
import { admin } from '../middleware/admin';
import { uploadCocktailImage } from '../middleware/upload';

const router = Router();

router.get('/my', auth, getMyCocktails);
router.get('/admin/unpublished', auth, admin, getUnpublishedCocktails);
router.get('/', auth, getCocktails);
router.put('/:id/rating', auth, rateCocktail);
router.get('/:id', auth, getCocktail);
router.post('/', auth, uploadCocktailImage.single('image'), createCocktail);
router.delete('/:id', auth, deleteCocktail);
router.patch('/:id/publish', auth, admin, publishCocktail);

export default router;