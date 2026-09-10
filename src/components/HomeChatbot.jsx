import React, { useState, useEffect, useRef } from 'react';
import './HomeChatbot.css';

const HomeChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'starkin', text: '¡Hola! Soy Starkin, tu experto en envíos. ¿En qué te puedo ayudar hoy?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isScrolling, setIsScrolling] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  // Detectar scroll para micro-interacción de ocultamiento
  useEffect(() => {
    let scrollTimeout;
    
    const handleScroll = () => {
      setIsScrolling(true);
      
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 250); // Vuelve a la normalidad 250ms después de detener el scroll
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  const handleSend = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInputText('');
    setIsTyping(true);

    // Simular respuesta de la IA
    setTimeout(() => {
      let reply = `He recibido tu mensaje: "${text}". Como asistente IA, te ayudaré con tu encomienda en un momento.`;
      
      const textLower = text.toLowerCase();
      if (textLower.includes('rastrear') || textLower.includes('seguimiento') || textLower.includes('dónde está')) {
        reply = "Para rastrear tu envío, por favor indícame el número de seguimiento de 9 dígitos que aparece en tu comprobante.";
      } else if (textLower.includes('cotizar') || textLower.includes('valor') || textLower.includes('precio')) {
        reply = "¡Claro! Puedes cotizar rápidamente haciendo clic en el botón 'Cotizar envío' en el menú de la página, o si gustas, dime el origen, destino y peso de tu paquete aquí.";
      } else if (textLower.includes('sucursal') || textLower.includes('horario') || textLower.includes('dónde')) {
        reply = "Contamos con más de 300 sucursales a lo largo de Chile. ¿En qué comuna o ciudad estás buscando?";
      }

      setMessages(prev => [...prev, { sender: 'starkin', text: reply }]);
      setIsTyping(false);
    }, 1500);
  };

  const suggestions = [
    '­ƒôì Rastrear un envío',
    '­ƒÆ▓ Cotizar paquete',
    '­ƒÅó Buscar sucursal'
  ];

  return (
    <>
      {/* Botón flotante (Estado inactivo) */}
      {!isOpen && (
        <button 
          className={`home-chat-fab ${isScrolling ? 'is-scrolling' : ''}`} 
          onClick={() => setIsOpen(true)}
          aria-label="Abrir asistente de Starken"
        >
          <div className="home-chat-pulse"></div>
          <img src="/starkin-chatia.png" alt="Starkin IA" className="home-chat-avatar-img" />
          <div className="home-chat-badge">1</div>
        </button>
      )}

      {/* Backdrop (Solo móvil) */}
      {isOpen && (
        <div className="home-chat-backdrop" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Panel del Chat */}
      <div className={`home-chat-panel ${isOpen ? 'open' : ''}`}>
        <div className="home-chat-header">
          <div className="home-chat-header-info">
            <div className="home-chat-header-avatar">
              <img src="/starkin-chatia.png" alt="Starkin IA" />
              <span className="online-dot"></span>
            </div>
            <div className="home-chat-header-text">
              <h3>Starkin IA</h3>
              <p>Asistente Virtual en Línea</p>
            </div>
          </div>
          <button className="home-chat-close-btn" onClick={() => setIsOpen(false)}>
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="home-chat-body">
          {messages.map((msg, idx) => (
            <div key={idx} className={`home-chat-msg-row ${msg.sender}`}>
              {msg.sender === 'starkin' && <img src="/starkin-chatia.png" alt="Starkin" className="home-chat-msg-avatar" />}
              <div className={`home-chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="home-chat-msg-row starkin">
              <img src="/starkin-chatia.png" alt="Starkin" className="home-chat-msg-avatar" />
              <div className="home-chat-bubble starkin typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="home-chat-footer">
          <div className="home-chat-suggestions">
            {suggestions.map((sug, idx) => (
              <button key={idx} className="home-chat-chip" onClick={() => handleSend(sug)}>
                {sug}
              </button>
            ))}
          </div>
          <form className="home-chat-input-area" onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}>
            <input 
              type="text" 
              placeholder="Escribe tu consulta aquí..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="home-chat-send-btn" disabled={!inputText.trim()}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default HomeChatbot;
