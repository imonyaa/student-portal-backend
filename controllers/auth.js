import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, role, academicLevel, academicYear, major, group } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      role,
      academicLevel,
      academicYear,
      major,
      group,
    });

    if (user) {
      const token = generateToken(user._id);

      // Set token in a cookie
      res.cookie('token', token, {
        httpOnly: true, // Make cookie inaccessible to JavaScript
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'strict', // Protect against CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiry (30 days)
      });

      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        academicLevel: user.academicLevel,
        academicYear: user.academicYear,
        major: user.major,
        group: user.group,
        token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      // Set token in a cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        academicLevel: user.academicLevel,
        academicYear: user.academicYear,
        major: user.major,
        group: user.group,
        // Return token in response only if needed for other purposes
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Public
export const logout = (req, res) => {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0), // Set expiry to 0 to remove the cookie
    });
  
    res.status(200).json({ message: 'Logged out successfully' });
  };