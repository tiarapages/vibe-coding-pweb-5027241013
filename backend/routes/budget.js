const express = require('express');
const Budget = require('../models/Budget');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/budget
// @desc    Get user budget
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    let budget = await Budget.findOne({ userId: req.userId });
    
    if (!budget) {
      // Buat budget default jika belum ada
      const defaultCategories = [
        // Grup A - Pokok
        { name: 'Makan Berat', group: 'Pokok', allocated: 0, spent: 0, remaining: 0 },
        { name: 'Galon/Air', group: 'Pokok', allocated: 0, spent: 0, remaining: 0 },
        { name: 'Listrik/Token', group: 'Pokok', allocated: 0, spent: 0, remaining: 0 },
        { name: 'Laundry', group: 'Pokok', allocated: 0, spent: 0, remaining: 0 },
        { name: 'Transport', group: 'Pokok', allocated: 0, spent: 0, remaining: 0 },
        { name: 'Perlengkapan Kos', group: 'Pokok', allocated: 0, spent: 0, remaining: 0 },
        // Grup B - Lifestyle
        { name: 'Skincare/Bodycare', group: 'Lifestyle', allocated: 0, spent: 0, remaining: 0 },
        { name: 'Fashion', group: 'Lifestyle', allocated: 0, spent: 0, remaining: 0 },
        { name: 'Jajan/Nongkrong', group: 'Lifestyle', allocated: 0, spent: 0, remaining: 0 },
        { name: 'Self Reward', group: 'Lifestyle', allocated: 0, spent: 0, remaining: 0 },
        // Grup C - Lainnya
        { name: 'Obat/Vitamin', group: 'Lainnya', allocated: 0, spent: 0, remaining: 0 },
        { name: 'Tugas Kuliah', group: 'Lainnya', allocated: 0, spent: 0, remaining: 0 },
        { name: 'Dana Darurat', group: 'Lainnya', allocated: 0, spent: 0, remaining: 0 }
      ];

      budget = await Budget.create({
        userId: req.userId,
        totalBudget: 0,
        currentBalance: 0,
        categories: defaultCategories
      });
    }

    res.json({ success: true, data: budget });
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/budget/initialize
// @desc    Set initial budget
// @access  Private
router.post('/initialize', authMiddleware, async (req, res) => {
  try {
    const { totalBudget, categoryAllocations } = req.body;

    let budget = await Budget.findOne({ userId: req.userId });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    budget.totalBudget = totalBudget;
    budget.currentBalance = totalBudget;

    // Update category allocations
    if (categoryAllocations && Array.isArray(categoryAllocations)) {
      categoryAllocations.forEach(allocation => {
        const category = budget.categories.find(cat => cat.name === allocation.name);
        if (category) {
          category.allocated = allocation.amount;
          category.remaining = allocation.amount;
        }
      });
    }

    await budget.save();

    res.json({ 
      success: true, 
      message: 'Budget berhasil diinisialisasi!', 
      data: budget 
    });
  } catch (error) {
    console.error('Initialize budget error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/budget/update
// @desc    Update budget after transaction
// @access  Private
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { category, amount } = req.body;

    let budget = await Budget.findOne({ userId: req.userId });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

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

    res.json({ 
      success: true, 
      message: 'Budget updated', 
      data: budget,
      isCritical,
      criticalMessage: isCritical ? 'Saldo Kritis! Hemat dulu bestie!' : null
    });
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
