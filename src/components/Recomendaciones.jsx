import React, { useState, useEffect, useRef } from 'react';
import './Recomendaciones.css';

const Recomendaciones = () => {
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
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const items = [
    {
      id: 1,
      title: 'Recomendaciones de embalaje',
      desc: 'Te invitamos a formar parte de nuestro mundo empresas y disfrutar de los servicios que tenemos para ti.'
    },
    {
      id: 2,
      title: 'Carga prohibida',
      desc: 'Te invitamos a formar parte de nuestro mundo empresas y disfrutar de los servicios que tenemos para ti.'
    },
    {
      id: 3,
      title: 'Condiciones generales de servicio',
      desc: 'Te invitamos a formar parte de nuestro mundo empresas y disfrutar de los servicios que tenemos para ti.'
    }
  ];

  return (
    <section className="recom-section" ref={sectionRef}>
      {/* Caja verde que contiene las tarjetas y el fondo */}
      <div className="recom-green-box">
        {/* Fondo con la mascota y las flechas */}
        <div className="recom-bg-image"></div>
        
        {/* Contenido (tarjetas y título) */}
        <div className={`recom-content-container ${isVisible ? 'animate-fade-left' : ''}`}>
          <h2 className="recom-title">RECOMENDACIONES</h2>
          
          <div className="recom-list">
            {items.map((item, idx) => (
              <div 
                key={item.id} 
                className="recom-card"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className="recom-card-text">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <button className="recom-btn">Conocer más</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Recomendaciones;
