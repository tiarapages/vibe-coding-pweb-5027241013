import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { budgetAPI, transactionAPI } from '../services/api';
import { Wallet, Calendar, Calculator, Star, ArrowRight, Battery } from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [budget, setBudget] = useState(null);
  const [todayExpenses, setTodayExpenses] = useState(0);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [budgetRes, todayRes, transactionsRes] = await Promise.all([
        budgetAPI.getBudget(),
        transactionAPI.getTodayExpenses(),
        transactionAPI.getAllTransactions()
      ]);
      
      console.log('Budget data:', budgetRes.data.data);
      console.log('Today expenses:', todayRes.data.data.total);
      
      setBudget(budgetRes.data.data);
      setTodayExpenses(todayRes.data.data.total);
      
      // Calculate weekly expenses
      const weekly = calculateWeeklyExpenses(transactionsRes.data.data);
      setWeeklyData(weekly);
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateWeeklyExpenses = (transactions) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayExpenses = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= date && tDate < nextDate;
      }).reduce((sum, t) => sum + t.amount, 0);
      
      weekData.push({
        day: days[date.getDay()],
        amount: dayExpenses,
        date: date.getDate()
      });
    }
    
    console.log('Weekly Data:', weekData);
    return weekData;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getProgressColor = (remaining, allocated) => {
    const percentage = (remaining / allocated) * 100;
    if (percentage > 50) return '#00ff88';
    if (percentage > 20) return '#ffaa00';
    return '#ff4444';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Animated Background Shapes */}
      <div className="floating-shapes">
        <div className="shape shape-circle-1"></div>
        <div className="shape shape-circle-2"></div>
        <div className="shape shape-circle-3"></div>
        <div className="shape shape-square-1"></div>
        <div className="shape shape-square-2"></div>
        <div className="shape shape-bubble-1"></div>
        <div className="shape shape-bubble-2"></div>
        <div className="shape shape-bubble-3"></div>
      </div>

      {/* Top Bar - Sticky */}
      <div className="topbar">
        <div className="topbar-content">
          <span className="app-name">Cuane</span>
          <div className="topbar-right">
            <span className="user-greeting">Hi, {user?.name}</span>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Pengeluaran Hari Ini */}
        <div className="expenses-today">
          <h2>Today's Expenses</h2>
          <p className="amount-display">{formatCurrency(todayExpenses)}</p>
        </div>

        {/* Budget Progress Bar */}
        <div className="budget-progress-container">
          <div className="progress-header">
            <div className="progress-label">
              <Battery size={20} />
              <span>Budget Health</span>
            </div>
            <span className={`progress-percentage ${
              ((budget?.currentBalance || 0) / (budget?.totalBudget || 1) * 100) < 10 ? 'critical' :
              ((budget?.currentBalance || 0) / (budget?.totalBudget || 1) * 100) < 50 ? 'warning' : 'good'
            }`}>
              {Math.round((budget?.currentBalance || 0) / (budget?.totalBudget || 1) * 100)}%
            </span>
          </div>
          <div className="progress-bar-wrapper">
            <div 
              className={`progress-bar-fill ${
                ((budget?.currentBalance || 0) / (budget?.totalBudget || 1) * 100) < 10 ? 'critical' :
                ((budget?.currentBalance || 0) / (budget?.totalBudget || 1) * 100) < 50 ? 'warning' : 'good'
              }`}
              style={{ width: `${Math.min((budget?.currentBalance || 0) / (budget?.totalBudget || 1) * 100, 100)}%` }}
            >
              <div className="progress-shine"></div>
            </div>
          </div>
          {((budget?.currentBalance || 0) / (budget?.totalBudget || 1) * 100) < 10 && (
            <div className="progress-alert critical">
               Critical! Budget almost depleted
            </div>
          )}
        </div>

        {/* Summary Section */}
        <div className="summary-section">
          <div className="summary-card">
            <h3>Budget</h3>
            <p className="amount">{formatCurrency(budget?.totalBudget || 0)}</p>
          </div>
          <div className="summary-card highlight">
            <h3>Account Balance</h3>
            <p className="amount">{formatCurrency(budget?.currentBalance || 0)}</p>
            {budget?.currentBalance <= 50000 && (
              <div className="critical-alert">
                Critical Balance! Please save up!
              </div>
            )}
          </div>
        </div>

        {/* Menu Grid - 4 Items */}
        <div className="menu-grid">
          <button 
            className="menu-card"
            onClick={() => navigate('/tracking')}
          >
            <div className="menu-icon">
              <Wallet size={32} />
            </div>
            <div className="menu-content">
              <h3>Expense Tracking</h3>
              <p className="menu-description">Track your daily expenses with ease</p>
              <span className="menu-link">
                Get Started <ArrowRight size={16} />
              </span>
            </div>
          </button>

          <button 
            className="menu-card"
            onClick={() => navigate('/calendar')}
          >
            <div className="menu-icon">
              <Calendar size={32} />
            </div>
            <div className="menu-content">
              <h3>Calendar View</h3>
              <p className="menu-description">View your expenses in calendar format</p>
            </div>
          </button>

          <button 
            className="menu-card"
            onClick={() => navigate('/calculator')}
          >
            <div className="menu-icon">
              <Calculator size={32} />
            </div>
            <div className="menu-content">
              <h3>Calculator</h3>
              <p className="menu-description">Quick calculations on the go</p>
            </div>
          </button>

          <button 
            className="menu-card"
            onClick={() => navigate('/wishlist')}
          >
            <div className="menu-icon">
              <Star size={32} />
            </div>
            <div className="menu-content">
              <h3>Wishlist</h3>
              <p className="menu-description">Save items you want to buy</p>
            </div>
          </button>
        </div>

        {/* Weekly Expenses Chart */}
        <div className="chart-section">
          <h2 className="chart-title">Weekly Expenses</h2>
          <div className="chart-container">
            <div className="chart-y-axis">
              {[4, 3, 2, 1, 0].map((i) => {
                const value = i * 50000;
                return (
                  <div key={i} className="y-label">
                    {value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                  </div>
                );
              })}
            </div>
            <div className="chart-bars">
              {weeklyData.map((data, index) => {
                const maxY = 200000; // 4 x 50000 = 200k max
                const heightPercent = data.amount > 0 ? Math.min((data.amount / maxY) * 100, 100) : 0;
                
                console.log(`Day ${data.day}: amount=${data.amount}, height=${heightPercent}%`);
                
                return (
                  <div key={index} className="bar-wrapper">
                    <div className="bar-container">
                      {data.amount > 0 && (
                        <div 
                          className="bar" 
                          style={{ height: `${heightPercent}%` }}
                          title={`${data.day} - ${formatCurrency(data.amount)}`}
                        >
                          <span className="bar-value">
                            {data.amount >= 1000 ? `${(data.amount / 1000).toFixed(0)}k` : data.amount}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="bar-label">
                      <div>{data.day}</div>
                      <div className="bar-date">{data.date}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
