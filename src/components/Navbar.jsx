import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Limpiar sesión al visitar el home page
  if (location.pathname === '/') {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
  }

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');
  let logoSrc = '/logo.png';
  let logoStyle = {};

  let avatarBgColor = '#029E47';
  let roleLabel = 'Personas';

  if (isLoggedIn) {
    if (userRole === 'Somos Partner') {
      logoSrc = '/logo-starken-morado.png';
      logoStyle = { height: '40px' };
      avatarBgColor = '#411C72';
      roleLabel = 'Somos Partner';
    } else if (userRole === 'Empresas') {
      logoSrc = '/logo.png';
      logoStyle = { filter: 'hue-rotate(40deg) saturate(0.8) brightness(1.1)' };
      avatarBgColor = '#33798C';
      roleLabel = 'Empresas';
    } else {
      avatarBgColor = '#029E47';
      roleLabel = 'Personas';
    }
  }

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/select-role' || location.pathname.startsWith('/dashboard') || location.pathname === '/marketplace';
  if (isAuthPage) return null;

  return (
    <div className={`navbar-container ${isMobileMenuOpen ? 'mobile-menu-active' : ''}`}>
      {/* Top Navigation Row */}
      <div className="top-nav">
        <div className="top-nav-segments">
          <Link to="/" className={`segment-link ${location.pathname === '/' ? 'active' : ''}`}>Personas</Link>
          <a href="#" onClick={(e) => e.preventDefault()} className="segment-link">Emprendedores</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="segment-link">Empresas</a>
          <Link to="/internacional" className={`segment-link ${location.pathname === '/internacional' ? 'active' : ''}`}>Internacional</Link>
        </div>
        <a href="#" onClick={(e) => e.preventDefault()} className="top-nav-help">
          Centro de ayuda 
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </a>
      </div>

      {/* Main Navigation Row */}
      <nav className="main-nav">
        <div className="main-nav-left">
          <Link to="/" className="nav-brand-link">
            <img src={logoSrc} style={logoStyle} alt="Starken Logo" className="nav-logo" />
          </Link>
        </div>
        
        <div className="main-links">
          <a href="#" onClick={(e) => e.preventDefault()} className="main-link">
            Envíos
            <svg className="chevron-down" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} className="main-link">Puntos red Starken</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="main-link">Servicios</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="main-link">Tarifas</a>
        </div>
        
        <div className="main-nav-right">
          <div className="nav-actions">
            {isLoggedIn ? (
              <div className="nav-profile-container" ref={profileRef} style={{ position: 'relative' }}>
                <div 
                  className="nav-profile-active" 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    padding: '8px 16px',
                    borderRadius: '24px',
                    background: '#f3f4f6',
                    fontWeight: 600,
                    fontSize: '13px',
                    color: '#029E47'
                  }}
                >
                  <span>Hola Ivan</span>
                  <svg style={{ transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
                
                {isProfileDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '44px',
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 9999,
                    width: '160px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '6px 0',
                    textAlign: 'left'
                  }}>
                    <button
                      onClick={() => {
                        localStorage.removeItem('isLoggedIn');
                        localStorage.removeItem('userRole');
                        setIsProfileDropdownOpen(false);
                        navigate('/');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '8px 16px',
                        textAlign: 'left',
                        fontSize: '13px',
                        color: '#b91c1c',
                        cursor: 'pointer',
                        fontWeight: 600,
                        width: '100%'
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a href="#" onClick={(e) => { e.preventDefault(); }} className="btn-ingresar" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Ingresar</a>
            )}
          </div>

          {/* Hamburger Menu Toggle Button */}
          <button 
            className="hamburger-btn" 
            onClick={() => setIsMobileMenuOpen(true)} 
            aria-label="Abrir menú"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <div 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <img src="/logo.png" alt="Starken Logo" className="mobile-menu-logo" />
            <button 
              className="mobile-menu-close-btn" 
              onClick={() => setIsMobileMenuOpen(false)} 
              aria-label="Cerrar menú"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="mobile-menu-content">
            <div className="mobile-menu-links">
              <Link to="/internacional" className={`mobile-menu-link ${location.pathname === '/internacional' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <span className="font-bold text-[#029E47]">Internacional</span>
                <svg className="chevron-right text-[#029E47]" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>
              <a href="#" className="mobile-menu-link opacity-60 cursor-not-allowed" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); }}>
                <span>Envíos</span>
                <svg className="chevron-right" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </a>
              <a href="#" className="mobile-menu-link opacity-60 cursor-not-allowed" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); }}>
                <span>Puntos red Starken</span>
                <svg className="chevron-right" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </a>
              <a href="#" className="mobile-menu-link opacity-60 cursor-not-allowed" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); }}>
                <span>Servicios</span>
                <svg className="chevron-right" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </a>
              <a href="#" className="mobile-menu-link opacity-60 cursor-not-allowed" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); }}>
                <span>Tarifas</span>
                <svg className="chevron-right" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </a>
            </div>
            
            <div className="mobile-menu-divider"></div>
            
            <a href="#" className="mobile-menu-help opacity-60 cursor-not-allowed" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Centro de ayuda</span>
            </a>
            
            <div className="mobile-menu-actions">
              {isLoggedIn ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#333', textAlign: 'center' }}>Hola Ivan</span>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('isLoggedIn');
                      localStorage.removeItem('userRole');
                      setIsMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="mobile-btn-ingresar"
                    style={{ background: '#b91c1c', borderColor: '#b91c1c', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '40px', borderRadius: '20px' }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <a href="#" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); navigate('/login', { state: { from: location.pathname + location.search } }); }} className="mobile-btn-ingresar" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Ingresar</a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
