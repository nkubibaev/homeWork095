import { Router } from 'express';
import {createUser, loginUser, getMe,} from '../controllers/users';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/', createUser);
router.post('/login', loginUser);
router.get('/me', auth, getMe);

export default router;