import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { transactionAPI } from '../services/api';
import '../styles/Calendar.css';

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editForm, setEditForm] = useState({
    description: '',
    amount: '',
    category: '',
    paymentMethod: ''
  });

  const categories = [
    { value: 'Food', label: 'Food' },
    { value: 'Water/Gallon', label: 'Water/Gallon' },
    { value: 'Electricity/Token', label: 'Electricity/Token' },
    { value: 'Laundry', label: 'Laundry' },
    { value: 'Transport', label: 'Transport' },
    { value: 'Supplies', label: 'Supplies' },
    { value: 'Skincare/Bodycare', label: 'Skincare/Bodycare' },
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Snacks/Hangouts', label: 'Snacks/Hangouts' },
    { value: 'Self Reward', label: 'Self Reward' },
    { value: 'Medicine/Vitamins', label: 'Medicine/Vitamins' },
    { value: 'College Assignments', label: 'College Assignments' },
    { value: 'Emergency Fund', label: 'Emergency Fund' }
  ];

  const paymentMethods = [
    { value: 'Cash', label: 'Cash' },
    { value: 'QRIS', label: 'QRIS' },
    { value: 'Debit', label: 'Debit' }
  ];

  useEffect(() => {
    loadTransactions();
  }, [currentDate]);

  const loadTransactions = async () => {
    try {
      const response = await transactionAPI.getAllTransactions();
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Load transactions error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getTransactionsForDate = (day) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    return transactions.filter(t => {
      const tDate = new Date(t.date).toISOString().split('T')[0];
      return tDate === dateStr;
    });
  };

  const getTotalForDate = (day) => {
    const dayTransactions = getTransactionsForDate(day);
    return dayTransactions.reduce((sum, t) => sum + t.amount, 0);
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    const dayTransactions = getTransactionsForDate(day);
    setSelectedTransactions(dayTransactions);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
    setSelectedTransactions([]);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
    setSelectedTransactions([]);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction._id);
    setEditForm({
      description: transaction.description,
      amount: transaction.amount.toString(),
      category: transaction.category,
      paymentMethod: transaction.paymentMethod
    });
  };

  const handleUpdateTransaction = async (id) => {
    try {
      await transactionAPI.updateTransaction(id, {
        ...editForm,
        amount: parseFloat(editForm.amount)
      });
      await loadTransactions();
      setEditingTransaction(null);
      // Update selected transactions
      const dayTransactions = getTransactionsForDate(selectedDate.getDate());
      setSelectedTransactions(dayTransactions);
      alert('Transaksi berhasil diupdate!');
    } catch (error) {
      console.error('Update error:', error);
      alert('Gagal mengupdate transaksi');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Yakin mau hapus transaksi ini?')) {
      try {
        await transactionAPI.deleteTransaction(id);
        await loadTransactions();
        // Update selected transactions
        setSelectedTransactions(prev => prev.filter(t => t._id !== id));
      } catch (error) {
        console.error('Delete error:', error);
        alert('Gagal menghapus transaksi');
      }
    }
  };

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const calendarDays = [];

  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading Calendar...</p>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      {/* Header */}
      <div className="calendar-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">←</button>
        <h1>Kalender Pengeluaran</h1>
      </div>

      {/* Month Navigation */}
      <div className="month-navigation">
        <button onClick={handlePrevMonth} className="btn-nav">←</button>
        <h2 className="month-year">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={handleNextMonth} className="btn-nav">→</button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Day names header */}
        {dayNames.map(day => (
          <div key={day} className="calendar-day-name">{day}</div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="calendar-day empty"></div>;
          }

          const total = getTotalForDate(day);
          const hasTransactions = total > 0;
          const isToday = 
            day === new Date().getDate() && 
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear();
          const isSelected = 
            selectedDate && 
            day === selectedDate.getDate() &&
            currentDate.getMonth() === selectedDate.getMonth();

          return (
            <div 
              key={day} 
              className={`calendar-day ${hasTransactions ? 'has-transactions' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleDateClick(day)}
            >
              <div className="day-number">{day}</div>
              {hasTransactions && (
                <div className="day-amount">
                  {formatCurrency(total).replace('Rp', '').trim()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Transaction Details Modal */}
      {selectedDate && (
        <div className="modal-overlay" onClick={() => setSelectedDate(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="details-header">
              <h3>
                Transaksi {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </h3>
              <button onClick={() => setSelectedDate(null)} className="btn-close">✕</button>
            </div>

            {selectedTransactions.length > 0 ? (
              <div className="transactions-list">
                {selectedTransactions.map(transaction => (
                  <div key={transaction._id} className="transaction-item">
                    {editingTransaction === transaction._id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                          placeholder="Description"
                          className="edit-input"
                        />
                        <input
                          type="number"
                          value={editForm.amount}
                          onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                          placeholder="Amount"
                          className="edit-input"
                        />
                        <select
                          value={editForm.category}
                          onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                          className="edit-input"
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                        <select
                          value={editForm.paymentMethod}
                          onChange={(e) => setEditForm({...editForm, paymentMethod: e.target.value})}
                          className="edit-input"
                        >
                          <option value="">Select Payment Method</option>
                          {paymentMethods.map(method => (
                            <option key={method.value} value={method.value}>{method.label}</option>
                          ))}
                        </select>
                        <div className="edit-actions">
                          <button onClick={() => handleUpdateTransaction(transaction._id)} className="btn-save">Save</button>
                          <button onClick={() => setEditingTransaction(null)} className="btn-cancel">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="transaction-info">
                          <div className="transaction-category">{transaction.category}</div>
                          <div className="transaction-description">{transaction.description}</div>
                          <div className="transaction-payment">{transaction.paymentMethod}</div>
                        </div>
                        <div className="transaction-actions">
                          <div className="transaction-amount">{formatCurrency(transaction.amount)}</div>
                          <button 
                            onClick={() => handleEditTransaction(transaction)} 
                            className="btn-edit"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteTransaction(transaction._id)} 
                            className="btn-delete"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                <div className="transactions-total">
                  <strong>Total:</strong>
                  <strong>{formatCurrency(selectedTransactions.reduce((sum, t) => sum + t.amount, 0))}</strong>
                </div>
              </div>
            ) : (
              <div className="no-transactions">
                <p>Tidak ada transaksi di tanggal ini</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
