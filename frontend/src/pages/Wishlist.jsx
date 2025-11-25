import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wishlistAPI } from '../services/api';
import { Star, ArrowLeft, Plus, X, Trash2 } from 'lucide-react';
import '../styles/Wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlists, setWishlists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadWishlists();
  }, []);

  const loadWishlists = async () => {
    try {
      const response = await wishlistAPI.getAllWishlist();
      console.log('Wishlist data:', response.data.data);
      setWishlists(response.data.data);
    } catch (error) {
      console.error('Load wishlist error:', error);
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

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = new Intl.NumberFormat('id-ID').format(value);
    setFormData({ ...formData, price: formatted });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.price) {
      setError('Name and price are required!');
      return;
    }

    const priceValue = parseInt(formData.price.replace(/\./g, ''));
    
    const submitData = new FormData();
    submitData.append('itemName', formData.name);
    submitData.append('targetPrice', priceValue);
    submitData.append('description', formData.description || '');
    if (formData.image) {
      submitData.append('image', formData.image);
    }

    try {
      setLoading(true);
      await wishlistAPI.createWishlist(submitData);
      setSuccess('Wishlist berhasil ditambahkan!');
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        description: '',
        image: null
      });
      setImagePreview(null);
      setShowForm(false);
      
      // Reload wishlists
      await loadWishlists();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this wishlist?')) {
      try {
        await wishlistAPI.deleteWishlist(id);
        setSuccess('Wishlist deleted successfully!');
        await loadWishlists();
      } catch (error) {
        setError('Failed to delete wishlist');
      }
    }
  };

  if (loading && wishlists.length === 0) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading Wishlist...</p>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      {/* Header */}
      <div className="wishlist-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          <ArrowLeft size={20} />
        </button>
        <h1>
          <Star className="wishlist-icon" size={24} />
          My Wishlist
        </h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-add">
          {showForm ? <X size={20} /> : <Plus size={20} />}
        </button>
      </div>

      {/* Success/Error Messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Form Modal */}
      {showForm && (
        <div className="form-modal">
          <form onSubmit={handleSubmit} className="wishlist-form">
            <h2>Add New Wishlist</h2>

            <div className="form-group">
              <label htmlFor="name">Wishlist Name *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: iPhone 15 Pro Max"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <div className="input-with-prefix">
                <span className="prefix">Rp</span>
                <input
                  type="text"
                  id="price"
                  value={formData.price}
                  onChange={handlePriceChange}
                  placeholder="2.000.000"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description (optional)</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Wishlist description..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Wishlist Photo (optional)</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
                Batal
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Wishlist Grid */}
      <div className="wishlist-grid">
        {wishlists.length === 0 ? (
          <div className="empty-state">
            <Star className="empty-state-icon" size={80} />
            <p>No wishlists yet</p>
            <button onClick={() => setShowForm(true)} className="btn-add-first">
              <Plus size={20} />
              Add First Wishlist
            </button>
          </div>
        ) : (
          wishlists.map((item) => (
            <div key={item._id} className="wishlist-card">
              {item.imageUrl ? (
                <div className="card-image">
                  <img 
                    src={`http://localhost:5000${item.imageUrl}`} 
                    alt={item.itemName}
                    onError={(e) => {
                      console.log('Image load error:', item.imageUrl);
                      e.target.style.display = 'none';
                    }}
                    onLoad={() => console.log('Image loaded:', item.imageUrl)}
                  />
                </div>
              ) : (
                <div className="card-image-placeholder">
                  <span>📷</span>
                </div>
              )}
              <div className="card-content">
                <h3 className="card-title">{item.itemName}</h3>
                <p className="card-price">{formatCurrency(item.targetPrice)}</p>
                {item.description && (
                  <p className="card-description">{item.description}</p>
                )}
                <button 
                  onClick={() => handleDelete(item._id)} 
                  className="btn-delete-card"
                >
                  <Trash2 size={16} />
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Wishlist;
