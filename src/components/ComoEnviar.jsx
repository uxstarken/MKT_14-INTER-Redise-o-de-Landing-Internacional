import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './ComoEnviar.css';

const steps = [
  {
    id: 1,
    icon: <img src="/icono-caja.png" alt="Prepara tu envío" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />,
    titleGreen: "Prepara",
    titleDark: "tu envío",
    description: "¡Protege tu envío! Asegúrate de que esté correctamente embalado antes de enviarlo.",
    shortDescription: "Protege tu envío antes de enviarlo",
    btnText: "Cómo embalar",
    link: "#"
  },
  {
    id: 2,
    icon: <img src="/icono-check.png" alt="Crea tu envío" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />,
    titleGreen: "Crea",
    titleDark: "tu envío",
    description: "Completa los datos, elige quien paga y ¡listo! Hazlo online o presencial. Si lo haces en línea, recibirás la etiqueta vía mail.",
    shortDescription: "Completa los datos en línea o presencial",
    btnText: "Crear envío",
    link: "/emitir"
  },
  {
    id: 3,
    icon: <img src="/icono-tienda.png" alt="Entrega tu envío" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />,
    titleGreen: "Entrega",
    titleDark: "tu envío",
    description: "Deja tu paquete en un Punto Starken. Si creaste tu envío online, lleva la etiqueta; si no puedes imprimirla, ¡lo haremos por ti!",
    shortDescription: "Déjalo en cualquiera de nuestros puntos",
    btnText: "Buscar sucursales",
    link: "#"
  },
  {
    id: 4,
    icon: <img src="/icono-camion.png" alt="Sigue tu envío" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.3)' }} />,
    titleGreen: "Sigue",
    titleDark: "tu envío",
    description: "Haz seguimiento de tu envío en cualquier momento y desde cualquier dispositivo.",
    shortDescription: "Haz seguimiento en tiempo real",
    btnText: "Seguimiento",
    link: "#"
  }
];

const ComoEnviar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Solo animar una vez
        }
      },
      { 
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleGridScroll = () => {
    if (!gridRef.current) return;
    const scrollLeft = gridRef.current.scrollLeft;
    const clientWidth = gridRef.current.clientWidth;
    const scrollWidth = gridRef.current.scrollWidth;

    if (scrollLeft <= 10) {
      setActiveStepIndex(0);
      return;
    }

    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      setActiveStepIndex(3);
      return;
    }

    const cardWidth = gridRef.current.children[0]?.offsetWidth || clientWidth;
    const gap = 12;
    const index = Math.round(scrollLeft / (cardWidth + gap));
    setActiveStepIndex(Math.min(Math.max(index, 0), 3));
  };

  const scrollToStep = (idx) => {
    if (!gridRef.current) return;
    const cardWidth = gridRef.current.children[0]?.offsetWidth || 0;
    const gap = 12;
    gridRef.current.scrollTo({
      left: idx * (cardWidth + gap),
      behavior: 'smooth'
    });
    setActiveStepIndex(idx);
  };

  return (
    <section className="como-enviar-section" ref={sectionRef}>
      <h2 className="como-enviar-title">Cómo enviar con <span>STARKEN</span> <br className="mobile-br" />en 4 pasos</h2>
      
      <div 
        className="como-enviar-grid"
        ref={gridRef}
        onScroll={handleGridScroll}
      >
        {steps.map((step, index) => (
          <div 
            className={`card-animation-wrapper ${isVisible ? 'animate-slide-up' : ''}`} 
            key={step.id}
            style={{ animationDelay: `${index * 0.25}s` }}
          >
            <div className="como-enviar-card">
              <div className="card-watermark">
                {step.id}
              </div>
              
              <div className="card-icon">
                {step.icon}
              </div>
              
              <h3 className="card-step-title">
                <span>{step.titleGreen}</span> {step.titleDark}
              </h3>
              
              <div className="card-divider"></div>
              
              <p className="card-text desktop-desc">
                {step.description}
              </p>
              
              <p className="card-text mobile-desc">
                {step.shortDescription}
              </p>

              {step.link && step.link !== '#' ? (
                <Link to={step.link} className="card-btn">
                  {step.btnText}
                </Link>
              ) : (
                <button className="card-btn">
                  {step.btnText}
                </button>
              )}

              {step.link && step.link !== '#' ? (
                <Link to={step.link} className="card-link-mobile">
                  {step.btnText} <svg className="link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </Link>
              ) : (
                <span className="card-link-mobile">
                  {step.btnText} <svg className="link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="como-enviar-dots">
        {steps.map((_, idx) => (
          <button
            key={idx}
            className={`como-enviar-dot ${activeStepIndex === idx ? 'active' : ''}`}
            onClick={() => scrollToStep(idx)}
            aria-label={`Ir al paso ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default ComoEnviar;
