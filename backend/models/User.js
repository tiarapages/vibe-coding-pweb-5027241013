const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  name: {
    type: String,
    required: true
  },
  initialBudget: {
    type: Number,
    default: 0
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  categoryBudgets: {
    // Grup A - Pokok
    makanBerat: { type: Number, default: 0 },
    galonAir: { type: Number, default: 0 },
    listrikToken: { type: Number, default: 0 },
    laundry: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    perlengkapanKos: { type: Number, default: 0 },
    
    // Grup B - Lifestyle
    skincare: { type: Number, default: 0 },
    fashion: { type: Number, default: 0 },
    jajanNongkrong: { type: Number, default: 0 },
    selfReward: { type: Number, default: 0 },
    
    // Grup C - Lainnya
    obatVitamin: { type: Number, default: 0 },
    tugasKuliah: { type: Number, default: 0 },
    danaDarurat: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password sebelum save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method untuk compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
