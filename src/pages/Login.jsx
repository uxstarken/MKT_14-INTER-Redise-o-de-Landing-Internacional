import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  // New state variables for 2FA and Role selection
  const [step, setStep] = useState('credentials'); // 'credentials' or '2fa'
  const [twoFactorMethod, setTwoFactorMethod] = useState('email'); // Default to email first
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [showResentAlert, setShowResentAlert] = useState(false);

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (location.state?.loggedOut) {
      setShowLogoutAlert(true);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => {
        setShowLogoutAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  // Focus the first input of verification code when transitioning to 2FA step
  useEffect(() => {
    if (step === '2fa') {
      setTimeout(() => {
        if (inputRefs[0].current) {
          inputRefs[0].current.focus();
        }
      }, 100);
    }
  }, [step, twoFactorMethod]);

  // Auto-submit code when all 4 boxes are filled
  useEffect(() => {
    if (step === '2fa' && verificationCode.every(char => char !== '')) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        if (location.state?.from) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userRole', 'Empresas');
          navigate(location.state.from, { state: { openBoleta: true } });
        } else if (location.state?.fromCotizar) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userRole', 'Empresas');
          navigate('/dashboard', { state: { ...location.state.cotizarState, fromCotizar: true, initialRole: 'Empresas' } });
        } else {
          // Redirect to enterprise dashboard
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userRole', 'Empresas');
          navigate('/');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [verificationCode, step, navigate, location]);

  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) {
      newErrors.email = 'El correo o RUT es obligatorio';
    }
    if (!password) newErrors.password = 'La contraseña es obligatoria';
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Automatically check if user has an enterprise role (e.g. contains 'mitrex' or 'empresa')
        const isEnterprise = email.toLowerCase().includes('mitrex') || email.toLowerCase().includes('empresa');
        if (isEnterprise) {
          setStep('2fa');
        } else {
          if (location.state?.from) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', 'Persona Natural');
            navigate(location.state.from, { state: { openBoleta: true } });
          } else if (location.state?.fromCotizar) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', 'Persona Natural');
            navigate('/dashboard', { state: { ...location.state.cotizarState, fromCotizar: true, initialRole: 'Persona Natural' } });
          } else {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', 'Persona Natural');
            navigate('/');
          }
        }
      }, 1200);
    }
  };

  const handleCodeChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const newCode = [...verificationCode];
    
    if (value) {
      newCode[index] = value[value.length - 1];
      setVerificationCode(newCode);
      // Move focus to next input
      if (index < 3 && inputRefs[index + 1].current) {
        inputRefs[index + 1].current.focus();
      }
    } else {
      newCode[index] = '';
      setVerificationCode(newCode);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!verificationCode[index] && index > 0 && inputRefs[index - 1].current) {
        const newCode = [...verificationCode];
        newCode[index - 1] = '';
        setVerificationCode(newCode);
        inputRefs[index - 1].current.focus();
      } else {
        const newCode = [...verificationCode];
        newCode[index] = '';
        setVerificationCode(newCode);
      }
    }
  };

  const handleResendCode = (e) => {
    e.preventDefault();
    setShowResentAlert(true);
    setVerificationCode(['', '', '', '']);
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
    const timer = setTimeout(() => {
      setShowResentAlert(false);
    }, 4000);
    return () => clearTimeout(timer);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-section">
        <div className="auth-form-card">
          <Link to="/" style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <img src="/logo.png" alt="Starken Logo" style={{ height: '88px' }} />
          </Link>
          
          {showLogoutAlert && (
            <div className="auth-logout-alert">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: '#10b981', flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 8v4l3 3"></path>
              </svg>
              <span>Sesión cerrada correctamente. ¡Hasta pronto!</span>
              <button type="button" className="auth-logout-alert-close" onClick={() => setShowLogoutAlert(false)}>×</button>
            </div>
          )}

          {showResentAlert && (
            <div className="auth-resent-alert">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: '#10b981', flexShrink: 0 }}>
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Código reenviado con éxito.</span>
            </div>
          )}

          {step === 'credentials' ? (
            <>
              <h2>Iniciar sesión</h2>
              <p>Bienvenido de vuelta a Starken</p>

              <form onSubmit={handleLogin}>
                <div className="auth-input-group">
                  <label>Correo electrónico o RUT</label>
                  <input 
                    type="text" 
                    className={`auth-input ${errors.email ? 'error' : ''}`}
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors({...errors, email: null}); }}
                  />
                  {errors.email && <span className="auth-microcopy">{errors.email}</span>}
                </div>

                <div className="auth-input-group" style={{ marginBottom: '8px' }}>
                  <label>Contraseña</label>
                  <div className="password-input-wrapper">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className={`auth-input ${errors.password ? 'error' : ''}`}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrors({...errors, password: null}); }}
                    />

                    <button 
                      type="button" 
                      className="password-toggle-btn" 
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <span className="auth-microcopy">{errors.password}</span>}
                </div>
                
                <Link to="#" className="forgot-password-link">¿Olvidaste tu contraseña?</Link>

                <button type="submit" className="btn-auth-primary" disabled={isLoading}>
                  {isLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <svg className="auth-spinner" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                        <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1"></path>
                      </svg>
                      Iniciando sesión...
                    </span>
                  ) : "Iniciar Sesión"}
                </button>
              </form>

              <div className="auth-separator">O ingresa con</div>

              <div className="social-login-container">
                <button className="btn-social">
                  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continuar con Google
                </button>
              </div>

              <div className="auth-footer-link">
                ¿No tienes cuenta? 
                <Link to="/register">Regístrate aquí</Link>
              </div>
            </>
          ) : (
            // Double Validation (2FA) View
            <div className="two-factor-container">
              <h2>Bienvenidos Mitrex</h2>
              
              {twoFactorMethod === 'sms' ? (
                <p className="two-factor-desc">
                  Para validar su ingreso hemos enviado un código a su teléfono <strong>+56X XXXX XX546</strong>
                </p>
              ) : (
                <p className="two-factor-desc">
                  Para validar su ingreso hemos enviado un código a su correo <strong>joaXXXXX@mitrex.cl</strong>
                </p>
              )}

              <div className="two-factor-code-section">
                <label className="two-factor-label">Ingresar código:</label>
                
                {isLoading ? (
                  <div className="two-factor-loader-container">
                    <svg className="auth-spinner" viewBox="0 0 24 24" width="30" height="30" stroke="#029E47" strokeWidth="3" fill="none" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                      <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1"></path>
                    </svg>
                    <span style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>Validando código...</span>
                  </div>
                ) : (
                  <div className="two-factor-inputs-row">
                    {verificationCode.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={inputRefs[idx]}
                        type="text"
                        maxLength="1"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        className="two-factor-input-box"
                        value={digit}
                        onChange={(e) => handleCodeChange(e, idx)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="two-factor-actions">
                <a href="#" className="two-factor-resend-link" onClick={handleResendCode}>
                  ¿No recibes el código? Reenviar código.
                </a>
              </div>

              <div className="two-factor-switch-container">
                <p className="two-factor-switch-label">Puedes validar también con:</p>
                {twoFactorMethod === 'sms' ? (
                  <button 
                    type="button" 
                    className="link-two-factor-switch"
                    onClick={() => { setTwoFactorMethod('email'); setVerificationCode(['', '', '', '']); }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="switch-icon">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Correo electrónico
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="link-two-factor-switch"
                    onClick={() => { setTwoFactorMethod('sms'); setVerificationCode(['', '', '', '']); }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="switch-icon">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    Mensaje de texto
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="auth-banner-section">
        <div className="auth-banner-content">
          <h2>Conectamos tus envíos</h2>
          <p>Gestiona, cotiza y emite tus envíos desde un solo lugar de manera rápida y segura.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;


