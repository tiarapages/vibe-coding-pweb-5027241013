import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionAPI } from '../services/api';
import '../styles/Tracking.css';

const Tracking = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    customCategory: '',
    paymentMethod: 'Tunai',
    note: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const categories = [
    { value: 'makanBerat', label: 'Food' },
    { value: 'galonAir', label: 'Water/Gallon' },
    { value: 'listrikToken', label: 'Electricity/Token' },
    { value: 'laundry', label: 'Laundry' },
    { value: 'transport', label: 'Transport' },
    { value: 'perlengkapanKos', label: 'Supplies' },
    { value: 'skincare', label: 'Skincare/Bodycare' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'jajanNongkrong', label: 'Snacks/Hangouts' },
    { value: 'selfReward', label: 'Self Reward' },
    { value: 'obatVitamin', label: 'Medicine/Vitamins' },
    { value: 'tugasKuliah', label: 'College Assignments' },
    { value: 'danaDarurat', label: 'Emergency Fund' }
  ];

  const formatCurrency = (value) => {
    const number = value.replace(/\D/g, '');
    return new Intl.NumberFormat('id-ID').format(number);
  };

  const handleAmountChange = (e) => {
    const formatted = formatCurrency(e.target.value);
    setFormData({ ...formData, amount: formatted });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const amountValue = parseInt(formData.amount.replace(/\./g, ''));
      const category = formData.category === 'Other' ? formData.customCategory : formData.category;

      if (!amountValue || amountValue <= 0) {
        setError('Enter a valid amount');
        setLoading(false);
        return;
      }

      if (!category) {
        setError('Select a category');
        setLoading(false);
        return;
      }

      const response = await transactionAPI.createTransaction({
        amount: amountValue,
        category,
        description: formData.note || 'No description',
        paymentMethod: formData.paymentMethod,
        date: formData.date
      });

      if (response.data.isCritical) {
        alert('⚠️ ' + response.data.criticalMessage);
      }

      setSuccess('✅ Transaction saved successfully!');
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        customCategory: '',
        paymentMethod: 'Cash',
        note: '',
        image: null
      });

      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tracking-container">
      <div className="tracking-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">←</button>
        <h1>Tracking Pengeluaran</h1>
      </div>

      <div className="tracking-content">
        <form onSubmit={handleSubmit} className="tracking-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {/* Date Input */}
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          {/* Amount Input */}
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <div className="input-with-prefix">
              <span className="prefix">Rp</span>
              <input
                type="text"
                id="amount"
                value={formData.amount}
                onChange={handleAmountChange}
                placeholder="2.000.000"
                required
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Custom Category Input (if Other selected) */}
          {formData.category === 'Other' && (
            <div className="form-group">
              <label htmlFor="customCategory">Other Category</label>
              <input
                type="text"
                id="customCategory"
                value={formData.customCategory}
                onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                placeholder="Enter category..."
                required
              />
            </div>
          )}

          {/* Payment Method */}
          <div className="form-group">
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            >
              <option value="Cash">Cash</option>
              <option value="QRIS">QRIS</option>
              <option value="Debit/Transfer">Debit/Transfer</option>
            </select>
          </div>

          {/* Note */}
          <div className="form-group">
            <label htmlFor="note">Note</label>
            <textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Transaction note..."
              rows="3"
            ></textarea>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label htmlFor="image">Upload Receipt (Optional)</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {formData.image && (
              <div className="image-preview">
                <span>📷 {formData.image.name}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-save"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Tracking;
