import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Wallet, DollarSign, Sparkles } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    initialBudget: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatCurrency = (value) => {
    const number = value.replace(/\D/g, '');
    return new Intl.NumberFormat('id-ID').format(number);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBudgetChange = (e) => {
    const formatted = formatCurrency(e.target.value);
    setFormData({ ...formData, initialBudget: formatted });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi
    if (formData.password !== formData.confirmPassword) {
      setError('Password incorrect!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters!');
      return;
    }

    setLoading(true);

    const budgetValue = formData.initialBudget 
      ? parseInt(formData.initialBudget.replace(/\./g, '')) 
      : 0;

    console.log('Registering with budget:', budgetValue);

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      budgetValue
    );
    
    console.log('Register result:', result);
    
    if (result.success) {
      alert('Registration successful! Please login.');
      navigate('/login');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-neon-purple/10 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-neon-pink/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-neon-violet/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="w-full max-w-2xl animate-slide-up relative z-10">
        {/* Money icons floating */}
        <div className="absolute -top-8 -right-8 text-neon-pink opacity-20 animate-float">
          <DollarSign size={48} />
        </div>
        <div className="absolute -bottom-6 -left-6 text-neon-purple opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>
          <Wallet size={40} />
        </div>
        
        <div className="bg-gray-900/90 backdrop-blur-xl border-2 border-neon-purple/30 p-10 rounded-2xl relative overflow-hidden shadow-2xl">
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-purple/5 to-transparent animate-shimmer" 
               style={{ backgroundSize: '200% 100%' }} />
          
          {/* Glow corners */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-neon-pink/30 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-neon-purple/30 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <Sparkles className="text-neon-pink animate-pulse" size={32} />
                <h1 className="text-5xl font-bold bg-gradient-to-r from-neon-purple via-neon-pink to-neon-violet bg-clip-text text-transparent">
                  Cuane
                </h1>
                <Sparkles className="text-neon-purple animate-pulse" size={32} style={{ animationDelay: '0.5s' }} />
              </div>
              <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
                <Wallet size={16} className="text-neon-pink" />
                Manage your finances smartly!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-900/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-neon-purple flex items-center gap-2">
                  <User size={16} className="text-neon-pink" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="flex h-14 w-full rounded-xl border-2 border-gray-700 bg-gray-900/50 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-neon-purple flex items-center gap-2">
                  <Mail size={16} className="text-neon-pink" />
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="flex h-14 w-full rounded-xl border-2 border-gray-700 bg-gray-900/50 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="initialBudget" className="text-sm font-semibold text-neon-purple flex items-center gap-2">
                  <Wallet size={16} className="text-neon-pink" />
                  Budget Awal (Opsional)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                    Rp
                  </span>
                  <input
                    id="initialBudget"
                    type="text"
                    placeholder="2.000.000"
                    value={formData.initialBudget}
                    onChange={handleBudgetChange}
                    className="flex h-14 w-full rounded-xl border-2 border-gray-700 bg-gray-900/50 pl-12 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple/20 transition-all"
                  />
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Sparkles size={12} className="text-neon-pink" />
                  The budget you have for this month
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-neon-purple flex items-center gap-2">
                  <Lock size={16} className="text-neon-pink" />
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Minimal 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="flex h-14 w-full rounded-xl border-2 border-gray-700 bg-gray-900/50 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-neon-purple flex items-center gap-2">
                  <Lock size={16} className="text-neon-pink" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Re-type your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="flex h-14 w-full rounded-xl border-2 border-gray-700 bg-gray-900/50 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple/20 transition-all"
                  />
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Sparkles size={12} className="text-neon-pink" />
                  Secure your account with a strong password
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-violet hover:opacity-90 font-bold text-lg rounded-xl shadow-lg hover:shadow-neon-purple/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed border-2 border-neon-purple/30 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Wallet size={20} />
                      Create Account
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" 
                     style={{ backgroundSize: '200% 100%' }} />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-neon-pink hover:text-neon-purple font-bold transition-all hover:underline inline-flex items-center gap-1"
                >
                  Login here
                  <Sparkles size={14} />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
