const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET || 'budgetbestie_secret_key_2025', {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, initialBudget } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email sudah terdaftar' 
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      name,
      initialBudget: initialBudget || 0,
      currentBalance: initialBudget || 0
    });

    // Create default budget for user
    const Budget = require('../models/Budget');
    const defaultCategories = [
      { name: 'Makan Berat', group: 'Pokok', allocated: 0, spent: 0, remaining: 0 },
      { name: 'Galon/Air', group: 'Pokok', allocated: 0, spent: 0, remaining: 0 },
      { name: 'Listrik/Token', group: 'Pokok', allocated: 0, spent: 0, remaining: 0 },
      { name: 'Laundry', group: 'Pokok', allocated: 0, spent: 0, remaining: 0 },
      { name: 'Transport', group: 'Pokok', allocated: 0, spent: 0, remaining: 0 },
      { name: 'Perlengkapan Kos', group: 'Pokok', allocated: 0, spent: 0, remaining: 0 },
      { name: 'Skincare/Bodycare', group: 'Lifestyle', allocated: 0, spent: 0, remaining: 0 },
      { name: 'Fashion', group: 'Lifestyle', allocated: 0, spent: 0, remaining: 0 },
      { name: 'Jajan/Nongkrong', group: 'Lifestyle', allocated: 0, spent: 0, remaining: 0 },
      { name: 'Self Reward', group: 'Lifestyle', allocated: 0, spent: 0, remaining: 0 },
      { name: 'Obat/Vitamin', group: 'Lainnya', allocated: 0, spent: 0, remaining: 0 },
      { name: 'Tugas Kuliah', group: 'Lainnya', allocated: 0, spent: 0, remaining: 0 },
      { name: 'Dana Darurat', group: 'Lainnya', allocated: 0, spent: 0, remaining: 0 }
    ];

    await Budget.create({
      userId: user._id,
      totalBudget: initialBudget || 0,
      currentBalance: initialBudget || 0,
      categories: defaultCategories
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        initialBudget: user.initialBudget,
        currentBalance: user.currentBalance,
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email atau password salah' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email atau password salah' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login berhasil!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        initialBudget: user.initialBudget,
        currentBalance: user.currentBalance,
        categoryBudgets: user.categoryBudgets,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   PUT /api/auth/budget
// @desc    Update budget (initial or category)
// @access  Private
router.put('/budget', authMiddleware, async (req, res) => {
  try {
    const { initialBudget, categoryBudgets } = req.body;
    
    const user = await User.findById(req.userId);

    if (initialBudget !== undefined) {
      user.initialBudget = initialBudget;
      user.currentBalance = initialBudget;
    }

    if (categoryBudgets) {
      user.categoryBudgets = { ...user.categoryBudgets, ...categoryBudgets };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Budget berhasil diupdate!',
      data: user
    });
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;
