import { validationResult } from 'express-validator';
import authService from '../services/authService.js';
import { generateToken } from '../middleware/auth.js';

class AuthController {
  /**
   * Register a new user
   * @route   POST /api/auth/register
   * @access  Public
   */
  async register(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password } = req.body;

      // Call service to register user
      const user = await authService.registerUser({ username, email, password });

      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      });
    } catch (error) {
      console.error('Register error:', error);

      if (error.message === 'User already exists with this email or username') {
        return res.status(400).json({ message: error.message });
      }

      res.status(500).json({ message: 'Server error during registration' });
    }
  }

  /**
   * Authenticate user and get token
   * @route   POST /api/auth/login
   * @access  Public
   */
  async login(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Call service to authenticate user
      const user = await authService.loginUser(email, password);

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      });
    } catch (error) {
      console.error('Login error:', error);

      if (error.message === 'Invalid email or password') {
        return res.status(401).json({ message: error.message });
      }

      res.status(500).json({ message: 'Server error during login' });
    }
  }

  /**
   * Get current logged in user
   * @route   GET /api/auth/me
   * @access  Private
   */
  async getCurrentUser(req, res) {
    try {
      const user = await authService.getUserById(req.user._id);

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new AuthController();
