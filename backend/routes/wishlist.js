const express = require('express');
const multer = require('multer');
const path = require('path');
const Wishlist = require('../models/Wishlist');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'wishlist-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// @route   GET /api/wishlist
// @desc    Get all wishlist items for user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: wishlistItems.length,
      data: wishlistItems
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   POST /api/wishlist
// @desc    Create new wishlist item with image upload
// @access  Private
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { itemName, targetPrice } = req.body;

    // Validasi
    if (!itemName || !targetPrice) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nama barang dan harga target wajib diisi' 
      });
    }

    // Get image URL if uploaded
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    // Create wishlist item
    const wishlistItem = await Wishlist.create({
      userId: req.userId,
      itemName,
      targetPrice,
      imageUrl
    });

    res.status(201).json({
      success: true,
      message: 'Item wishlist berhasil ditambahkan!',
      data: wishlistItem
    });
  } catch (error) {
    console.error('Create wishlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   PUT /api/wishlist/:id
// @desc    Update wishlist item
// @access  Private
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { itemName, targetPrice } = req.body;
    
    const wishlistItem = await Wishlist.findById(req.params.id);

    if (!wishlistItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item tidak ditemukan' 
      });
    }

    // Check ownership
    if (wishlistItem.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    // Update fields
    wishlistItem.itemName = itemName || wishlistItem.itemName;
    wishlistItem.targetPrice = targetPrice || wishlistItem.targetPrice;
    
    if (req.file) {
      wishlistItem.imageUrl = `/uploads/${req.file.filename}`;
    }

    await wishlistItem.save();

    res.json({
      success: true,
      message: 'Item wishlist berhasil diupdate!',
      data: wishlistItem
    });
  } catch (error) {
    console.error('Update wishlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   DELETE /api/wishlist/:id
// @desc    Delete wishlist item
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findById(req.params.id);

    if (!wishlistItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item tidak ditemukan' 
      });
    }

    // Check ownership
    if (wishlistItem.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    await Wishlist.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: 'Item wishlist berhasil dihapus!'
    });
  } catch (error) {
    console.error('Delete wishlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;
