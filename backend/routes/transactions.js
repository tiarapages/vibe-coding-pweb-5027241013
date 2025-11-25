import express from 'express';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Category mapping untuk field database
const categoryMapping = {
  'makanBerat': 'makanBerat',
  'galonAir': 'galonAir',
  'listrikToken': 'listrikToken',
  'laundry': 'laundry',
  'transport': 'transport',
  'perlengkapanKos': 'perlengkapanKos',
  'skincare': 'skincare',
  'fashion': 'fashion',
  'jajanNongkrong': 'jajanNongkrong',
  'selfReward': 'selfReward',
  'obatVitamin': 'obatVitamin',
  'tugasKuliah': 'tugasKuliah',
  'danaDarurat': 'danaDarurat'
};

// @route   GET /api/transactions
// @desc    Get all transactions for user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 });

    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   GET /api/transactions/today
// @desc    Get today's spending total
// @access  Private
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const transactions = await Transaction.find({
      user: req.user._id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    const totalToday = transactions.reduce((sum, t) => sum + t.amount, 0);

    res.json({
      success: true,
      data: {
        total: totalToday,
        count: transactions.length,
        transactions
      }
    });
  } catch (error) {
    console.error('Get today transactions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   POST /api/transactions
// @desc    Create new transaction
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { amount, category, description, paymentMethod, date } = req.body;

    // Validasi
    if (!amount || !category || !description || !paymentMethod) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mohon lengkapi semua field' 
      });
    }

    // Get user
    const user = await User.findById(req.user._id);

    // Check saldo cukup
    if (user.currentBalance < amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Saldo tidak cukup!' 
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      amount,
      category,
      description,
      paymentMethod,
      date: date || new Date()
    });

    // Update user balance (global & category)
    user.currentBalance -= amount;
    
    const categoryField = categoryMapping[category];
    if (categoryField && user.categoryBudgets[categoryField] !== undefined) {
      user.categoryBudgets[categoryField] -= amount;
      // Prevent negative
      if (user.categoryBudgets[categoryField] < 0) {
        user.categoryBudgets[categoryField] = 0;
      }
    }

    await user.save();

    // Check critical balance
    const isCritical = user.currentBalance <= 50000;

    res.status(201).json({
      success: true,
      message: 'Transaksi berhasil ditambahkan!',
      data: transaction,
      currentBalance: user.currentBalance,
      alert: isCritical ? {
        show: true,
        message: '⚠️ Saldo Kritis! Hemat dulu bestie!'
      } : null
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   PUT /api/transactions/:id
// @desc    Update transaction
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { amount, category, description, paymentMethod } = req.body;

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaksi tidak ditemukan' 
      });
    }

    // Check ownership
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    const user = await User.findById(req.user._id);
    const oldAmount = transaction.amount;
    const oldCategory = transaction.category;

    // Restore old balance first
    user.currentBalance += oldAmount;
    const oldCategoryField = categoryMapping[oldCategory];
    if (oldCategoryField && user.categoryBudgets[oldCategoryField] !== undefined) {
      user.categoryBudgets[oldCategoryField] += oldAmount;
    }

    // Apply new amount
    const newAmount = amount || transaction.amount;
    if (user.currentBalance < newAmount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Saldo tidak cukup!' 
      });
    }

    user.currentBalance -= newAmount;
    const newCategory = category || transaction.category;
    const newCategoryField = categoryMapping[newCategory];
    if (newCategoryField && user.categoryBudgets[newCategoryField] !== undefined) {
      user.categoryBudgets[newCategoryField] -= newAmount;
      if (user.categoryBudgets[newCategoryField] < 0) {
        user.categoryBudgets[newCategoryField] = 0;
      }
    }

    // Update transaction
    transaction.amount = newAmount;
    transaction.category = newCategory;
    transaction.description = description || transaction.description;
    transaction.paymentMethod = paymentMethod || transaction.paymentMethod;

    await user.save();
    await transaction.save();

    res.json({
      success: true,
      message: 'Transaksi berhasil diupdate!',
      data: transaction,
      currentBalance: user.currentBalance
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaksi tidak ditemukan' 
      });
    }

    // Check ownership
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    // Restore balance before delete
    const user = await User.findById(req.user._id);
    user.currentBalance += transaction.amount;
    
    const categoryField = categoryMapping[transaction.category];
    if (categoryField && user.categoryBudgets[categoryField] !== undefined) {
      user.categoryBudgets[categoryField] += transaction.amount;
    }

    await user.save();
    await transaction.deleteOne();

    res.json({
      success: true,
      message: 'Transaksi berhasil dihapus!',
      currentBalance: user.currentBalance
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

export default router;
