import { useNavigate } from 'react-router-dom';
import { Wallet, List, Star, ArrowRight } from 'lucide-react';
import '../styles/StartPage.css';

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <div className="startpage-container">
      {/* Animated Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Circle 1 */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl animate-float-slow"></div>
        
        {/* Floating Circle 2 */}
        <div className="absolute top-40 right-20 w-48 h-48 rounded-full bg-gradient-to-br from-pink-500/15 to-violet-500/15 blur-3xl animate-float-slower"></div>
        
        {/* Floating Square */}
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-br from-violet-500/10 to-purple-500/10 blur-2xl rotate-45 animate-float-reverse"></div>
        
        {/* Floating Circle 3 */}
        <div className="absolute top-1/2 right-1/3 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/10 blur-3xl animate-float-slow" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating Rectangle */}
        <div className="absolute bottom-20 right-10 w-56 h-32 bg-gradient-to-br from-pink-500/15 to-purple-500/15 blur-3xl rounded-full animate-float-slower" style={{ animationDelay: '1s' }}></div>
        
        {/* Small Floating Dots */}
        <div className="absolute top-60 left-1/3 w-16 h-16 rounded-full bg-purple-500/30 blur-xl animate-float-reverse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-40 left-1/2 w-20 h-20 rounded-full bg-pink-500/25 blur-xl animate-float-slow" style={{ animationDelay: '4s' }}></div>
        
        {/* Grid Lines Effect */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(168, 85, 247, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Header */}
      <header className="startpage-header">
        <div className="logo">
          <span className="logo-icon">💰</span>
          <span className="logo-text">CUANE</span>
        </div>
        <div className="header-buttons">
          <button onClick={() => navigate('/login')} className="btn-login">
            LOGIN
          </button>
          <button onClick={() => navigate('/register')} className="btn-register">
            REGISTER
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-label">NEXT-GEN MONEY MANAGEMENT</div>
        <h1 className="hero-title">
          <span className="title-secure">CUANE</span>
        
          <div className="title-underline"></div>
        </h1>
        <p className="hero-description">
          Your aesthetic financial companion for a stress-free college life
        </p>
        <p className="hero-tagline">Smart Saver. Dream Chaser.</p>
        
        <div className="hero-buttons">
          <button onClick={() => navigate('/register')} className="btn-get-started">
            GET STARTED <ArrowRight size={20} />
          </button>
          <button onClick={() => navigate('/login')} className="btn-existing">
            EXISTING USER
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">
            <Wallet size={32} />
          </div>
          <h3 className="feature-title">SMART BUDGETING</h3>
          <p className="feature-description">
            Maximize your monthly allowance efficiently. Say goodbye to being broke at the end of the month.
          </p>
        </div>

        <div className="feature-card feature-highlight">
          <div className="feature-icon">
            <List size={32} />
          </div>
          <h3 className="feature-title">ORGANIZED TRACKING</h3>
          <p className="feature-description">
            Keep your records neat. Every expense is automatically sorted into categories like Skincare, Food, or Transport.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Star size={32} />
          </div>
          <h3 className="feature-title">DREAM GOALS</h3>
          <p className="feature-description">
            Stay motivated by visualizing your wishlist. Save up and reach your self-reward targets faster!
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="startpage-footer">
        <p>© 2025 CUANE. ALL SYSTEMS OPERATIONAL.</p>
      </footer>
    </div>
  );
};

export default StartPage;
