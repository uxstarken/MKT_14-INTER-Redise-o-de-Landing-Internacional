import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FloatingMenu.css';

const FloatingMenu = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const tooltipRef = useRef(null);
  const navigate = useNavigate();

  // Cerrar el tooltip si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tooltipRef]);

  const handleSearch = () => {
    if (inputValue.trim()) {
      navigate(`/seguimiento?of=${inputValue.trim()}`);
    }
  };

  const handleClear = () => {
    setInputValue('');
  };

  return (
    <div className="floating-menu-wrapper">
      <div className="floating-menu-container">
        {/* Enlaces Izquierda */}
        <div className="fm-links">
          <button className="fm-link">
            <img src="/icono-cotizar.png" alt="" className="fm-icon-img" />
            <span>Cotizar</span>
          </button>
          
          <div className="fm-vertical-divider"></div>
          
          <button className="fm-link">
            <img src="/icono-emision.png" alt="" className="fm-icon-img" />
            <span>Enviar</span>
          </button>

          <div className="fm-vertical-divider"></div>
          
          <button className="fm-link">
            <img src="/Icono-gps.png" alt="" className="fm-icon-img" />
            <span>Punto Starken</span>
          </button>
        </div>

        {/* Buscador Derecha */}
        <div className="fm-search-area">
          <input 
            type="text" 
            placeholder="Haz tu seguimiento con tu n° de orden" 
            className="fm-search-input"
            maxLength={9}
            value={inputValue}
            onChange={(e) => {
              // Solo permite ingresar números
              const onlyNums = e.target.value.replace(/[^0-9]/g, '');
              setInputValue(onlyNums);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <div className="fm-search-actions">
            
            {/* Botón X para borrar (Solo visible si hay texto) */}
            {inputValue.length > 0 && (
              <button 
                className="fm-action-btn fm-clear-btn" 
                aria-label="Borrar"
                onClick={handleClear}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fm-icon gray">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
            
            {/* Botón de Búsqueda (Lupa) */}
            <button className="fm-action-btn search" aria-label="Buscar" onClick={handleSearch}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="fm-icon green">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            <div className="fm-divider"></div>

            {/* Contenedor interactivo del Tooltip (?) */}
            <div className="tooltip-container" ref={tooltipRef}>
              <button 
                className={`fm-action-btn ${showTooltip ? 'active' : ''}`}
                aria-label="Ayuda"
                onClick={() => setShowTooltip(!showTooltip)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fm-icon orange">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </button>

              {/* Popover elegante */}
              {showTooltip && (
                <div className="help-tooltip-popover">
                  <div className="tooltip-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#FF8A00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="tooltip-icon"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    <h4>¿Dónde encuentro mi número?</h4>
                  </div>
                  <p>
                    El número de envío es un código único de <strong>9 a 12 dígitos</strong> que asignamos a tu encomienda.
                  </p>
                  <p>
                    Lo encuentras en la sección de <em>descripción del comprobante</em> que te entregamos al realizar tu envío. Te recomendamos guardarlo muy bien, ya que con este número podrás hacer el seguimiento.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingMenu;
