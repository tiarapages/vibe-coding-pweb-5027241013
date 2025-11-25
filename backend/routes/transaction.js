const express = require('express');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/transactions
// @desc    Get all user transactions
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/transactions/today
// @desc    Get today's expenses
// @access  Private
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTransactions = await Transaction.find({
      userId: req.userId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    const totalToday = todayTransactions.reduce((sum, t) => sum + t.amount, 0);

    res.json({ 
      success: true, 
      data: {
        transactions: todayTransactions,
        total: totalToday
      }
    });
  } catch (error) {
    console.error('Get today transactions error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/transactions
// @desc    Create new transaction
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { amount, category, description, paymentMethod, date } = req.body;

    // Validate input
    if (!amount || !category || !description || !paymentMethod) {
      return res.status(400).json({ 
        success: false, 
        message: 'Semua field harus diisi' 
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      userId: req.userId,
      amount,
      category,
      description,
      paymentMethod,
      date: date || new Date()
    });

    // Update budget
    let budget = await Budget.findOne({ userId: req.userId });
    
    if (budget) {
      // Update category spent and remaining
      const categoryObj = budget.categories.find(cat => cat.name === category);
      if (categoryObj) {
        categoryObj.spent += amount;
        categoryObj.remaining = categoryObj.allocated - categoryObj.spent;
      }

      // Update current balance
      budget.currentBalance -= amount;
      await budget.save();

      // Check if balance is critical
      const isCritical = budget.currentBalance <= 50000;

      return res.status(201).json({ 
        success: true, 
        message: 'Transaksi berhasil ditambahkan!',
        data: transaction,
        budget: budget,
        isCritical,
        criticalMessage: isCritical ? 'Saldo Kritis! Hemat dulu bestie!' : null
      });
    }

    res.status(201).json({ 
      success: true, 
      message: 'Transaksi berhasil ditambahkan!',
      data: transaction 
    });

  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/transactions/:id
// @desc    Update transaction
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { amount, category, description, paymentMethod } = req.body;

    const transaction = await Transaction.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan' });
    }

    let budget = await Budget.findOne({ userId: req.userId });
    
    if (budget) {
      // Restore old amount
      const oldCategoryObj = budget.categories.find(cat => cat.name === transaction.category);
      if (oldCategoryObj) {
        oldCategoryObj.spent -= transaction.amount;
        oldCategoryObj.remaining = oldCategoryObj.allocated - oldCategoryObj.spent;
      }
      budget.currentBalance += transaction.amount;

      // Apply new amount
      const newAmount = amount || transaction.amount;
      const newCategory = category || transaction.category;
      
      const newCategoryObj = budget.categories.find(cat => cat.name === newCategory);
      if (newCategoryObj) {
        newCategoryObj.spent += newAmount;
        newCategoryObj.remaining = newCategoryObj.allocated - newCategoryObj.spent;
      }
      budget.currentBalance -= newAmount;
      
      await budget.save();
    }

    // Update transaction
    transaction.amount = amount || transaction.amount;
    transaction.category = category || transaction.category;
    transaction.description = description || transaction.description;
    transaction.paymentMethod = paymentMethod || transaction.paymentMethod;
    
    await transaction.save();

    res.json({ 
      success: true, 
      message: 'Transaksi berhasil diupdate!',
      data: transaction,
      budget: budget
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan' });
    }

    // Restore budget
    let budget = await Budget.findOne({ userId: req.userId });
    if (budget) {
      const categoryObj = budget.categories.find(cat => cat.name === transaction.category);
      if (categoryObj) {
        categoryObj.spent -= transaction.amount;
        categoryObj.remaining = categoryObj.allocated - categoryObj.spent;
      }
      budget.currentBalance += transaction.amount;
      await budget.save();
    }

    await Transaction.deleteOne({ _id: req.params.id });

    res.json({ 
      success: true, 
      message: 'Transaksi berhasil dihapus!',
      budget: budget
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
