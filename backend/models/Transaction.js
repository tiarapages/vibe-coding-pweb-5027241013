const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      // Grup A - Pokok
      'makanBerat', 'galonAir', 'listrikToken', 'laundry', 'transport', 'perlengkapanKos',
      // Grup B - Lifestyle
      'skincare', 'fashion', 'jajanNongkrong', 'selfReward',
      // Grup C - Lainnya
      'obatVitamin', 'tugasKuliah', 'danaDarurat'
    ]
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Tunai', 'QRIS', 'Debit/Transfer']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
