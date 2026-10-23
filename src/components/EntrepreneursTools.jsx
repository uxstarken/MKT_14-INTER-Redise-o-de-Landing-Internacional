import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './EntrepreneursTools.css';

const EntrepreneursTools = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px' 
      }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="entrepreneurs-section" ref={sectionRef}>
      <h2 className="entrepreneurs-title">
        Herramientas para <span>emprendedores</span>
      </h2>

      {/* Contenedor de Banner Somos Partner */}
      <div className={`ep-banners-row ${isVisible ? 'animate-zoom-in' : ''}`}>
        {/* Banner: Somos Partner */}
        <div className="ep-banner ep-banner-sp">
          {/* 1. Columna Logo */}
          <div className="ep-sp-logo-col">
            <img src="/logo-sp.png" alt="Somos Partner" className="ep-sp-logo" />
          </div>

          {/* 2. Columna Texto */}
          <div className="ep-sp-text-col">
            <h3 className="ep-sp-title">
              Inscríbete y accede a<br />
              <span className="ep-sp-highlight">todos nuestros beneficios</span>
            </h3>
            <p className="ep-sp-desc">
              Integra plugins en tu e-commerce y mejora la experiencia de tus envíos.
            </p>
          </div>

          {/* 3. Columna Acción */}
          <div className="ep-sp-action-col">
            <button className="ep-sp-btn">
              Inscríbete en Somos Partner
            </button>
          </div>

          {/* 4. Columna Imagen Sobresaliente */}
          <div className="ep-sp-image-col">
            <img src="/mujer-sp.png" alt="Emprendedora Somos Partner" className="ep-sp-img" />
          </div>
        </div>
      </div>

      {/* Tarjetas Secundarias */}
      <div className={`ep-cards-grid ${isVisible ? 'animate-cards' : ''}`}>
        {/* Card 1: Clientes Empresa */}
        <div className="ep-card-wrapper" style={{ animationDelay: '0.2s' }}>
          <div className="ep-card">
          <div className="ep-card-img-container">
            <img src="/clientes empresa.png" alt="Clientes Empresa" />
          </div>
          <div className="ep-card-content">
            <h4 className="ep-card-title">Clientes Empresa</h4>
            <p className="ep-card-desc">
              Te invitamos a formar parte de nuestro mundo empresas y disfrutar
              de los servicios que tenemos para ti.
            </p>
            <button className="ep-btn-green">Conocer más</button>
          </div>
        </div>
        </div>

        {/* Card 2: Internacional */}
        <div className="ep-card-wrapper" style={{ animationDelay: '0.4s' }}>
          <div className="ep-card">
          <div className="ep-card-img-container">
            <img src="/mujer-internacional.png" alt="Internacional" />
          </div>
          <div className="ep-card-content">
            <h4 className="ep-card-title">Internacional</h4>
            <p className="ep-card-desc">
              Facilitamos la recepción de paquetes desde el extranjero con el respaldo de una red experta en logística.
            </p>
            <button className="ep-btn-green">Conocer más</button>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EntrepreneursTools;
