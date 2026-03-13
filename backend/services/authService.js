import User from '../models/User.js';

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user
   */
  async registerUser({ username, email, password }) {
    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      throw new Error('User already exists with this email or username');
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    if (!user) {
      throw new Error('Failed to create user');
    }

    return user;
  }

  /**
   * Authenticate user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Authenticated user
   */
  async loginUser(email, password) {
    // Find user by email (need to select password explicitly)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    return user;
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

export default new AuthService();
