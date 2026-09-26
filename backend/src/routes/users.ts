import { Router } from 'express';
import { createUser, loginUser, getMe, googleLogin } from '../controllers/users';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/', createUser);
router.post('/login', loginUser);
router.get('/me', auth, getMe);
router.post('/google', googleLogin);

export default router;