import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ServicesCarousel.css';

const servicesData = [
  {
    id: 1,
    image: '/card-envio-local.png',
    badge: 'Nacional',
    price: 'Desde $2.000',
    title: 'Envío local',
    description: 'Realiza envíos dentro de tu ciudad con la máxima rapidez y eficiencia.'
  },
  {
    id: 2,
    image: '/card-envio-digital.png',
    badge: 'Digital',
    price: 'Desde $1.500',
    title: 'Envío digital',
    description: 'Gestiona tus etiquetados y envíos de manera 100% online y automatizada.'
  },
  {
    id: 3,
    image: '/card-expreso-aereo.png',
    badge: 'Nacional',
    price: 'Desde $3.500',
    title: 'Expreso aéreo',
    description: 'Envía a lo largo de todo Chile de forma prioritaria con conexión aérea.'
  },
  {
    id: 4,
    image: '/card-locker.png',
    badge: '24/7',
    price: 'Desde $1.800',
    title: 'Locker autoservicio',
    description: 'Entrega y retira tus paquetes a cualquier hora en nuestra red de lockers.'
  },
  {
    id: 5,
    image: '/card-servicio-embalaje.png',
    badge: 'Especial',
    price: 'Desde $1.000',
    title: 'Servicio embalaje',
    description: 'Protege tus envíos con materiales de alta calidad y asesoría experta.'
  }
];

const ServicesCarousel = () => {
  const navigate = useNavigate();
  const handleCardClick = (id) => {
    const idMap = {
      1: 'local',
      2: 'digital',
      3: 'aereo',
      4: 'locker',
      5: 'embalaje'
    };
    const stringId = idMap[id] || 'local';
    navigate(`/servicios?select=${stringId}`);
  };
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(4);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
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
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setCardsToShow(1);
      } else if (window.innerWidth <= 800) {
        setCardsToShow(2);
      } else {
        setCardsToShow(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const totalCards = servicesData.length;
  const maxIndex = totalCards - cardsToShow;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  // Lógica de Swipe para móviles
  const minSwipeDistance = 50; 
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) handleNext();
    if (distance < -minSwipeDistance) handlePrev();
  };

  return (
    <section className="services-section" ref={sectionRef}>
      <div className="services-container">
        <div className={`services-title-wrapper ${isVisible ? 'animate-fade-left' : ''}`}>
          <h2 className="services-title">Descubre tu <span>forma de enviar</span></h2>
        </div>
        
        <div className="carousel-wrapper">
          <button 
            className="carousel-arrow left" 
            onClick={handlePrev}
            aria-label="Anterior"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="3" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>

          <div 
            className="carousel-track-container"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEndEvent}
          >
            <div 
              className={`carousel-track ${isVisible ? 'animate-cards' : ''}`}
              style={{ transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)` }}
            >
              {servicesData.map((service, index) => (
                <div 
                  key={service.id} 
                  className="service-card-wrapper"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="service-card" onClick={() => handleCardClick(service.id)}>
                    <div className="service-image-container">
                      <img src={service.image} alt={service.title} />
                      <div className="price-badge">{service.badge}</div>
                    </div>
                    <div className="service-content">
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="carousel-arrow right" 
            onClick={handleNext}
            aria-label="Siguiente"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="3" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        <div className="carousel-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              className={`dot ${currentIndex === idx ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Ir a diapositiva ${idx + 1}`}
            />
          ))}
        </div>

        {/* Botón secundario: Ver todos los servicios */}
        <div className="services-footer-action">
          <button className="btn-secondary-services" onClick={() => navigate('/servicios')}>
            Ver todos los servicios
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesCarousel;
