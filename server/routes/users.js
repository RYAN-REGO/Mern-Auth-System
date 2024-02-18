import express from 'express';

import {signin, signup, syncData} from '../controllers/user.js';

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/logdata', syncData);

export default router;