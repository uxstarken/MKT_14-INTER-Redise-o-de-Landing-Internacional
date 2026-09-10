import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    // Si la misma sección está abierta, ciérrala. De lo contrario, abre la nueva.
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="footer-section">
      <div className="footer-container">
        
        {/* Columna 1: Marca y Descripción */}
        <div className="footer-col brand-col">
          <img src="/Logo-blanco.png" alt="Starken" className="footer-logo" />
          <p className="brand-text-bold">
            En Starken tenemos capacidad de adaptación y un enfoque constante en la innovación.
          </p>
          <p className="brand-text-light">
            Somos un operador logístico integral, capaz de brindar soluciones tecnológicas y transversales a personas, emprendedores y empresas a lo largo de todo Chile.
          </p>
          <p className="brand-text-action">
            ¡Envía con nosotros!
          </p>
          <div className="footer-badges">
            <img src="/premio-uno.png" alt="Premio Uno" className="footer-badge-img" />
            <img src="/premio-uno-ranking.png" alt="Premio Uno Ranking" className="footer-badge-img" />
            <img src="/premio-procalidad.png" alt="Premio Procalidad" className="footer-badge-img procalidad" />
          </div>
        </div>

        {/* Columna 2: Información */}
        <div className={`footer-col links-col ${openSection === 'info' ? 'open' : ''}`}>
          <h4 className="footer-heading" onClick={() => toggleSection('info')}>
            Información
            <svg className="footer-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </h4>
          <ul className="footer-links-list">
            <li><a href="#">Conoce la empresa</a></li>
            <li><a href="#">Condiciones de servicio</a></li>
            <li><a href="#">Código de conducta</a></li>
            <li><a href="#">Privacidad de datos</a></li>
            <li><a href="#">Prevención de delitos</a></li>
            <li><a href="#">Canal de denuncia</a></li>
          </ul>
        </div>

        {/* Columna 3: Accesos Rápidos */}
        <div className={`footer-col links-col ${openSection === 'accesos' ? 'open' : ''}`}>
          <h4 className="footer-heading" onClick={() => toggleSection('accesos')}>
            Accesos rápidos
            <svg className="footer-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </h4>
          <ul className="footer-links-list">
            <li><a href="#">Ser cliente Empresa</a></li>
            <li><a href="#">Ser Somos Partner</a></li>
            <li><a href="#">Ser Soy Starken</a></li>
            <li><a href="#">StarkenPro</a></li>
            <li><a href="#">Turcargo</a></li>
            <li><a href="#">Integraciones</a></li>
            <li><a href="#">Tarifa simple</a></li>
          </ul>
        </div>

        {/* Columna 4: Servicio al cliente */}
        <div className={`footer-col links-col ${openSection === 'servicio' ? 'open' : ''}`}>
          <h4 className="footer-heading" onClick={() => toggleSection('servicio')}>
            Servicio al cliente
            <svg className="footer-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </h4>
          <ul className="footer-links-list">
            <li><a href="#">Recomendaciones de embalaje</a></li>
            <li><a href="#">Carga prohibida</a></li>
            <li><a href="#">Carga Sobredimensionada</a></li>
            <li><a href="#">Asistente WhatsApp</a></li>
            <li><a href="#">Ingresar un reclamo</a></li>
          </ul>
        </div>

        {/* Columna 5: Redes y CTA */}
        <div className="footer-col social-col">
          <h4 className="footer-heading uppercase static">SÍGUENOS EN NUESTRAS REDES SOCIALES</h4>
          <hr className="footer-divider" />
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" aria-label="TikTok">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
            </a>
            <a href="#" aria-label="YouTube">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
            <a href="#" aria-label="LinkedIn">
               <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
          <button className="btn-trabaja">Trabaja con nosotros</button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
