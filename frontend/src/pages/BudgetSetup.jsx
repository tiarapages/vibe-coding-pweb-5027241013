import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { budgetAPI } from '../services/api';
import '../styles/BudgetSetup.css';

const BudgetSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    period: 'Monthly',
    totalBudget: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatCurrency = (value) => {
    const number = value.replace(/\D/g, '');
    return new Intl.NumberFormat('id-ID').format(number);
  };

  const handleBudgetChange = (e) => {
    const formatted = formatCurrency(e.target.value);
    setFormData({ ...formData, totalBudget: formatted });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const budgetValue = parseInt(formData.totalBudget.replace(/\./g, ''));
      
      if (!budgetValue || budgetValue <= 0) {
        setError('Please enter a valid budget amount');
        setLoading(false);
        return;
      }

      await budgetAPI.initializeBudget({
        totalBudget: budgetValue,
        categoryAllocations: []
      });

      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to setup budget');
      setLoading(false);
    }
  };

  return (
    <div className="budget-setup-container">
      <div className="budget-setup-box">
        <div className="setup-header">
          <h1>Setup Your Budget 💰</h1>
          <p>Set your budget for the selected period</p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="period">Budget Period</label>
            <select
              id="period"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="select-input"
            >
              <option value="Daily">Daily</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="totalBudget">Total Budget</label>
            <div className="input-with-prefix">
              <span className="prefix">Rp</span>
              <input
                type="text"
                id="totalBudget"
                value={formData.totalBudget}
                onChange={handleBudgetChange}
                placeholder="2.000.000"
                required
              />
            </div>
            <small>Example: 2,000,000</small>
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Start Budgeting'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BudgetSetup;
