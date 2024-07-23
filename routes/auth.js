import express from 'express';
import { register, login, logout } from '../controllers/auth.js';

const router = express.Router();

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Logout user
router.get('/logout', logout);

export default router;
