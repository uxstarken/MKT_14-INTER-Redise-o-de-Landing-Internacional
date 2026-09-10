import React, { useState, useEffect } from 'react';
import './SliderBanner.css';

const SliderBanner = ({ compact = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      titlePart1: "TU FORMA DE GANAR",
      titlePart2: "TIEMPO ",
      titlePart3: "ENVIANDO",
      subtitle: "Desde el primer click, envía rápido con seguridad y confianza.",
      buttonText: "Crea tu envío",
      image: "/starkin-banner.png",
      imageMobile: "/starkin-banner.png",
      imageAlt: "Mascota Starkin llevando paquetes"
    },
    {
      titlePart1: "CONECTAMOS TUS",
      titlePart2: "NEGOCIOS ",
      titlePart3: "A TODO CHILE",
      subtitle: "Llegamos a cada rincón con el mejor respaldo para tu empresa.",
      buttonText: "Conoce más",
      image: "/Hombre-banner.png",
      imageMobile: "/bannerverde-mobile.png",
      imageAlt: "Repartidor de Starken",
      layout: "courier-slide"
    },
    {
      titlePart1: "NUEVAS TARIFAS",
      titlePart2: "ESPECIALES ",
      titlePart3: "PARA PYMES",
      subtitle: "Optimiza tus costos con nuestros planes pensados para ti.",
      buttonText: "Cotizar ahora",
      image: "/slide3-bg.png",
      imageMobile: "/slide3-bg.png",
      imageAlt: "Mascota Starkin entregando paquete en casa",
      layout: "full-bleed-right"
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Auto-play cada 5 segundos
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  // Lógica de Swipe
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextSlide();
    if (distance < -minSwipeDistance) prevSlide();
  };

  return (
    <div
      className={`slider-banner-container ${compact ? 'compact-banner' : ''}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndEvent}
    >
      {/* Navigation Arrows */}
      <button className="slider-arrow prev-arrow" onClick={prevSlide} aria-label="Anterior">
        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button className="slider-arrow next-arrow" onClick={nextSlide} aria-label="Siguiente">
        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Track */}
      <div className="slider-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide, index) => (
          <div className={`slide ${slide.layout || ''}`} key={index}>
            {slide.layout === 'full-bleed-right' && (
              <div className="slide-bg-image-wrapper">
                <picture className="hero-banner-picture">
                  <source media="(max-width: 768px)" srcSet={slide.imageMobile} />
                  <img src={slide.image} alt={slide.imageAlt} className="slide-bg-image" />
                </picture>
              </div>
            )}

            <div className={`slide-content ${slide.layout === 'full-bleed-right' ? 'align-right' : ''}`}>
              <h1 className="slide-title">
                {slide.titlePart1}<br />
                {slide.titlePart2}<span className="slide-title-green">{slide.titlePart3}</span>
              </h1>
              <p className="slide-subtitle">{slide.subtitle}</p>
              <button className="slide-btn">{slide.buttonText}</button>
            </div>

            {slide.layout !== 'full-bleed-right' && (
              <div className="slide-image-section">
                <picture className="hero-banner-picture">
                  <source media="(max-width: 768px)" srcSet={slide.imageMobile} />
                  <img 
                    src={slide.image} 
                    alt={slide.imageAlt} 
                    className={`hero-banner-image ${slide.image.includes('starkin') ? 'starkin-mascot-img' : ''}`} 
                  />
                </picture>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default SliderBanner;
