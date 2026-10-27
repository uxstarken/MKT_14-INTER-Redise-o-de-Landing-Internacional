import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  Search, 
  HelpCircle, 
  X, 
  ArrowRight, 
  Mail, 
  Clock, 
  MessageCircle, 
  DollarSign,
  Layers,
  Package,
  Zap,
  Eye,
  Globe,
  Tag,
  TrendingDown,
  RefreshCw,
  ShieldCheck,
  Plane,
  ChevronDown
} from 'lucide-react';
import './Internacional.css';

const Internacional = () => {
  const navigate = useNavigate();

  // Tracking states
  const [trackingValue, setTrackingValue] = useState('');
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const helpRef = useRef(null);

  // Form states
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    celular: '',
    asunto: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef(null);

  const asuntoOptions = [
    { value: "consultas", label: "Consultas" },
    { value: "cotizacion", label: "Cotización" },
    { value: "reclamos", label: "Reclamos" },
  ];

  // Close tooltip or select when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setShowHelpTooltip(false);
      }
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [helpRef, selectRef]);

  const handleTrackingSearch = (e) => {
    if (e) e.preventDefault();
    if (trackingValue.trim()) {
      navigate(`/seguimiento?of=${trackingValue.trim()}`);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    if (name === 'nombre') {
      const val = value ? value.trim() : '';
      if (!val) {
        error = 'Nombre debe tener un mínimo de 3 letras.';
      } else if (val.length < 3) {
        error = 'Nombre debe tener un mínimo de 3 letras.';
      } else if (/[0-9]/.test(value)) {
        error = 'El nombre no debe contener números.';
      }
    } else if (name === 'correo') {
      const val = value ? value.trim() : '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val) {
        error = 'Ingrese un correo electrónico válido, siga el formato correo@mail.com';
      } else if (!val.includes('@') || !emailRegex.test(val)) {
        error = 'Ingrese un correo electrónico válido, siga el formato correo@mail.com';
      }
    } else if (name === 'celular') {
      const digits = value ? value.replace(/\D/g, '') : '';
      if (!digits) {
        error = 'Ingrese un número de teléfono válido.';
      } else if (digits.length < 9) {
        error = 'Ingrese un número de teléfono válido (9 dígitos, ej: 912345678).';
      }
    } else if (name === 'asunto') {
      if (!value) {
        error = 'Selecciona un asunto.';
      }
    }
    return error;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let cleanVal = value;

    // En nombre no se permiten números
    if (name === 'nombre') {
      cleanVal = value.replace(/[0-9]/g, '');
    }

    // En celular no se permiten letras, sólo números y máximo 9 dígitos
    if (name === 'celular') {
      cleanVal = value.replace(/\D/g, '').slice(0, 9);
    }

    setFormData(prev => ({
      ...prev,
      [name]: cleanVal
    }));

    // Si el campo ya fue tocado o hay error previo, validar en tiempo real
    if (formTouched[name] || formErrors[name]) {
      const err = validateField(name, cleanVal);
      setFormErrors(prev => ({
        ...prev,
        [name]: err
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormTouched(prev => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleSelectAsunto = (optValue) => {
    setFormData(prev => ({ ...prev, asunto: optValue }));
    setIsSelectOpen(false);
    setFormTouched(prev => ({ ...prev, asunto: true }));
    const err = validateField('asunto', optValue);
    setFormErrors(prev => ({ ...prev, asunto: err }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const errors = {
      nombre: validateField('nombre', formData.nombre),
      correo: validateField('correo', formData.correo),
      celular: validateField('celular', formData.celular),
      asunto: validateField('asunto', formData.asunto)
    };

    setFormTouched({
      nombre: true,
      correo: true,
      celular: true,
      asunto: true
    });
    setFormErrors(errors);

    const hasErrors = Object.values(errors).some(err => err !== '');
    if (hasErrors) {
      if (errors.nombre) {
        document.getElementById('nombre')?.focus();
      } else if (errors.correo) {
        document.getElementById('correo')?.focus();
      } else if (errors.celular) {
        document.getElementById('celular')?.focus();
      }
      return;
    }

    setFormSubmitted(true);
    setTimeout(() => {
      setFormData({
        nombre: '',
        correo: '',
        celular: '',
        asunto: ''
      });
      setFormErrors({});
      setFormTouched({});
    }, 1500);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="inter-page">
      {/* 1. HERO SECTION - FULL BLEED BANNER */}
      <section className="inter-hero-section">
        <div className="inter-hero-bg-wrapper">
          <img 
            src="/banner-internacional-3.png" 
            alt="Starken Internacional" 
            className="inter-hero-bg-img"
          />
          <div className="inter-hero-gradient-overlay"></div>
        </div>

        <div className="inter-hero-container">
          <div className="inter-hero-content">
            <h1 className="inter-hero-title">Descubre Starken Box</h1>
            <p className="inter-hero-lead">
              Accede a millones de productos en Estados Unidos. Con el respaldo de Starken y una experiencia pensada para que comprar sea&nbsp;más&nbsp;fácil.
            </p>
            <div className="inter-hero-actions">
              <a 
                href="https://starkenbox.com/registerstarken" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inter-hero-btn-lime"
              >
                Regístrate aquí
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BOTONERA / FLOATING MENU BAR (SIMILAR A HOME) */}
      <div className="inter-floating-menu-wrapper">
        <div className="inter-floating-menu-container">
          {/* Enlaces Izquierda - 4 Opciones */}
          <div className="inter-fm-links">
            <button 
              type="button" 
              onClick={() => scrollToSection('starken-box')} 
              className="inter-fm-link"
            >
              <Package size={22} className="inter-fm-icon-orange" strokeWidth={1.3} />
              <span>Starken Box</span>
            </button>

            <div className="inter-fm-vertical-divider"></div>

            <button 
              type="button" 
              onClick={() => scrollToSection('crossborder')} 
              className="inter-fm-link"
            >
              <Globe size={22} className="inter-fm-icon-orange" strokeWidth={1.3} />
              <span>Crossborder</span>
            </button>

            <div className="inter-fm-vertical-divider"></div>

            <button 
              type="button" 
              onClick={() => scrollToSection('forwarder')} 
              className="inter-fm-link"
            >
              <Plane size={22} className="inter-fm-icon-orange" strokeWidth={1.3} />
              <span>Forwarder</span>
            </button>

            <div className="inter-fm-vertical-divider"></div>

            <button 
              type="button" 
              onClick={() => scrollToSection('contacto')} 
              className="inter-fm-link"
            >
              <MessageCircle size={22} className="inter-fm-icon-orange" strokeWidth={1.3} />
              <span>Contáctanos</span>
            </button>
          </div>

          {/* Buscador Derecha */}
          <div className="inter-fm-search-area">
            <input 
              type="text" 
              placeholder="Haz tu seguimiento con tu n° de orden" 
              className="inter-fm-search-input"
              maxLength={12}
              value={trackingValue}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                setTrackingValue(onlyNums);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleTrackingSearch(e);
                }
              }}
            />
            <div className="inter-fm-search-actions">
              {/* Botón X para borrar */}
              {trackingValue.length > 0 && (
                <button 
                  type="button" 
                  className="inter-fm-action-btn inter-fm-clear-btn" 
                  aria-label="Borrar"
                  onClick={() => setTrackingValue('')}
                >
                  <X size={18} />
                </button>
              )}

              {/* Botón Lupa */}
              <button 
                type="button" 
                className="inter-fm-action-btn search" 
                aria-label="Buscar" 
                onClick={handleTrackingSearch}
              >
                <Search size={21} className="inter-fm-icon-green" strokeWidth={1.5} />
              </button>

              <div className="inter-fm-divider"></div>

              {/* Tooltip Ayuda (?) */}
              <div className="inter-tooltip-container" ref={helpRef}>
                <button 
                  type="button" 
                  className={`inter-fm-action-btn ${showHelpTooltip ? 'active' : ''}`}
                  aria-label="Ayuda"
                  onClick={() => setShowHelpTooltip(!showHelpTooltip)}
                >
                  <HelpCircle size={20} className="inter-fm-icon-orange" strokeWidth={1.5} />
                </button>

                {showHelpTooltip && (
                  <div className="inter-help-tooltip-popover">
                    <div className="inter-tooltip-header">
                      <HelpCircle size={20} className="inter-fm-icon-orange" strokeWidth={1.5} />
                      <h4>¿Dónde encuentro mi número?</h4>
                    </div>
                    <p>
                      El número de envío es un código único de <strong>9 a 12 dígitos</strong> que asignamos a tu orden de transporte o comprobante.
                    </p>
                    <p>
                      Lo encuentras en tu <em>orden de flete o en el correo de confirmación</em> que te entregamos al realizar el envío.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION: STARKEN BOX */}
      <section id="starken-box" className="inter-section inter-starkenbox-section">
        <div className="inter-container">
          <div className="inter-starkenbox-layout">
            <div className="inter-starkenbox-photos-side">
              <div className="inter-starkenbox-image-frame">
                <img 
                  src="/inter-starken-box.jpg" 
                  alt="Cliente Starken Box" 
                  className="inter-starkenbox-img"
                />
              </div>
            </div>

            <div className="inter-starkenbox-content-side">
              <div className="inter-highlight-title-wrapper">
                <h2 className="inter-brush-title">
                  Starken Box
                  <span className="inter-brush-accent"></span>
                </h2>
              </div>

              <ul className="inter-checklist">
                <li>
                  <div className="inter-check-icon"><Check size={14} strokeWidth={3} /></div>
                  <span>Sin cobros sorpresa. El valor que cotizas es el valor final que pagas. No tendrás cargos adicionales durante el proceso.</span>
                </li>
                <li>
                  <div className="inter-check-icon"><Check size={14} strokeWidth={3} /></div>
                  <span>Conoce cómo calculamos tu envío. El valor se calcula según el mayor entre el peso real y el peso volumétrico de la carga.</span>
                </li>
                <li>
                  <div className="inter-check-icon"><Check size={14} strokeWidth={3} /></div>
                  <span>Importar nunca fue tan fácil. Nosotros gestionamos la logística y el proceso aduanero por ti.</span>
                </li>
              </ul>

              <div className="inter-starkenbox-actions">
                <a 
                  href="https://starkenbox.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inter-btn-primary"
                >
                  <span>Saber más</span>
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION: SOLUCIONES A MEDIDA */}
      <section className="inter-section inter-soluciones-section">
        <div className="inter-container">
          <div className="inter-section-header">
            <h2 className="inter-main-heading">Soluciones a medida</h2>
            <p className="inter-sub-heading">
              Facilitamos tus envíos con eficiencia, alcance global y el respaldo de una red experta.
            </p>
            <div className="inter-header-divider"></div>
          </div>

          <div className="inter-soluciones-grid">
            {/* Pilar 1: Starken box */}
            <div className="inter-solucion-item">
              <div className="inter-solucion-img-frame">
                <img 
                  src="/inter-starken-box.jpg" 
                  alt="Starken Box Casilla USA" 
                  className="inter-solucion-photo"
                />
                <span className="inter-photo-badge">Casilla USA</span>
              </div>
              <div className="inter-solucion-info">
                <h3 className="inter-solucion-title">Starken box</h3>
                <p className="inter-solucion-desc">
                  Ofrecemos consolidaciones propias y regulares, end to end (USA, China y el resto del mundo), para emprendedores y empresas importadoras y/o exportadoras.
                </p>
                <a 
                  href="https://starkenbox.com/registerstarken" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inter-solucion-link"
                >
                  <span>Regístrate aquí</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* Pilar 2: Crossborder */}
            <div className="inter-solucion-item">
              <div className="inter-solucion-img-frame">
                <img 
                  src="/inter-crossborder-tech.jpg" 
                  alt="Crossborder Starken" 
                  className="inter-solucion-photo"
                />
                <span className="inter-photo-badge">E-commerce Global</span>
              </div>
              <div className="inter-solucion-info">
                <h3 className="inter-solucion-title">Crossborder</h3>
                <p className="inter-solucion-desc">
                  Servicio de Cross-Border internacional con logística nacional y fullfilment. Ofrecemos soluciones como traje a la medida para atender las necesidades del ecommerce mundial.
                </p>
              </div>
            </div>

            {/* Pilar 3: Forwarder */}
            <div className="inter-solucion-item">
              <div className="inter-solucion-img-frame">
                <img 
                  src="/inter-air-cargo.jpg" 
                  alt="Forwarder Starken" 
                  className="inter-solucion-photo"
                />
                <span className="inter-photo-badge">Carga & Courier</span>
              </div>
              <div className="inter-solucion-info">
                <h3 className="inter-solucion-title">Forwarder</h3>
                <p className="inter-solucion-desc">
                  Nuestra plataforma nos permite ofrecer servicio express courier end to end para cargas de todo el mundo hasta la puerta de tu casa. Como también servicios aéreos generales de importación y exportación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION: CROSSBORDER */}
      <section id="crossborder" className="inter-section inter-crossborder-section">
        <div className="inter-container">
          <div className="inter-crossborder-layout">
            {/* Left Column: Title + list of benefits + link */}
            <div className="inter-crossborder-left">
              <div className="inter-highlight-title-wrapper">
                <h2 className="inter-brush-title">
                  Crossborder
                  <span className="inter-brush-accent"></span>
                </h2>
              </div>

              <ul className="inter-checklist">
                <li>
                  <div className="inter-check-icon"><Check size={14} strokeWidth={3} /></div>
                  <span>Última milla con cobertura total</span>
                </li>
                <li>
                  <div className="inter-check-icon"><Check size={14} strokeWidth={3} /></div>
                  <span>Integración tecnológica</span>
                </li>
                <li>
                  <div className="inter-check-icon"><Check size={14} strokeWidth={3} /></div>
                  <span>Equipo de expertos</span>
                </li>
                <li>
                  <div className="inter-check-icon"><Check size={14} strokeWidth={3} /></div>
                  <span>Linehaul internacional, transporte eficiente</span>
                </li>
                <li>
                  <div className="inter-check-icon"><Check size={14} strokeWidth={3} /></div>
                  <span>Nacionalización y desaduanamiento, nos encargamos de todo el proceso</span>
                </li>
              </ul>

              <a 
                href="https://developers.starken.cl/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inter-link-action"
              >
                <span>Conoce nuestras integraciones</span>
                <ArrowRight size={18} />
              </a>
            </div>

            {/* Right Column: 3 Photographic Cards (without badges) */}
            <div className="inter-crossborder-cards-col">
              {/* Photo Card 1: Integración tecnológica */}
              <div className="inter-feature-photo-card">
                <div className="inter-feature-photo-wrap">
                  <img 
                    src="/inter-crossborder-tech.jpg" 
                    alt="Integración tecnológica" 
                    className="inter-feature-photo"
                  />
                </div>
                <div className="inter-feature-content">
                  <h4 className="inter-feature-title">Integración tecnológica</h4>
                  <p className="inter-feature-desc">
                    Nos adaptamos a tus sistemas con soluciones de integración eficiente.
                  </p>
                </div>
              </div>

              {/* Photo Card 2: Equipo de expertos */}
              <div className="inter-feature-photo-card">
                <div className="inter-feature-photo-wrap">
                  <img 
                    src="/inter-experts-team.jpg" 
                    alt="Equipo de expertos" 
                    className="inter-feature-photo"
                  />
                </div>
                <div className="inter-feature-content">
                  <h4 className="inter-feature-title">Equipo de expertos</h4>
                  <p className="inter-feature-desc">
                    Contamos con especialistas que facilitan cada etapa del proceso para una operación fluida.
                  </p>
                </div>
              </div>

              {/* Photo Card 3: Última milla con cobertura total */}
              <div className="inter-feature-photo-card">
                <div className="inter-feature-photo-wrap">
                  <img 
                    src="/inter-last-mile.jpg" 
                    alt="Última milla con cobertura total" 
                    className="inter-feature-photo"
                  />
                </div>
                <div className="inter-feature-content">
                  <h4 className="inter-feature-title">Última milla con cobertura total</h4>
                  <p className="inter-feature-desc">
                    Entregamos a lo largo de Chile con 300 sucursales, 100 puntos Soy Starken y una flota propia, asegurando tiempos de entrega estándar y express.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION: FORWARDER */}
      <section id="forwarder" className="inter-section inter-forwarder-section">
        <div className="inter-container">
          <div className="inter-highlight-title-wrapper">
            <h2 className="inter-brush-title">
              Forwarder
              <span className="inter-brush-accent"></span>
            </h2>
          </div>

          {/* SUBSECTION 1: SERVICIO TERRESTRE */}
          <div className="inter-forwarder-block">
            <div className="inter-forwarder-info">
              <h3 className="inter-forwarder-subtitle">Servicio terrestre</h3>
              <p className="inter-forwarder-desc">
                Movilizamos tu carga desde países vecinos con conexiones eficientes por carretera, integrando el transporte internacional terrestre con nuestros servicios de aduana y distribución nacional. Solución ideal para cargas medianas o pesadas con tiempos competitivos y costos controlados.
              </p>

              <div className="inter-forwarder-attributes-grid">
                <div className="inter-attr-item">
                  <div className="inter-attr-icon"><DollarSign size={20} /></div>
                  <span className="inter-attr-text">Costos controlados</span>
                </div>
                <div className="inter-attr-item">
                  <div className="inter-attr-icon"><Clock size={20} /></div>
                  <span className="inter-attr-text">Tiempos competitivos</span>
                </div>
                <div className="inter-attr-item">
                  <div className="inter-attr-icon"><Layers size={20} /></div>
                  <span className="inter-attr-text">Servicios integrados</span>
                </div>
                <div className="inter-attr-item">
                  <div className="inter-attr-icon"><Package size={20} /></div>
                  <span className="inter-attr-text">Cargas medianas o pesadas</span>
                </div>
              </div>
            </div>

            <div className="inter-forwarder-visual-card">
              <div className="inter-photo-showcase-frame">
                <img 
                  src="/inter-truck-land.jpg" 
                  alt="Servicio terrestre internacional" 
                  className="inter-showcase-photo"
                />
                <div className="inter-showcase-caption">
                  <span className="caption-tag">Transporte Terrestre</span>
                  <h4>Conexión Carretera Internacional</h4>
                </div>
              </div>
            </div>
          </div>

          {/* SUBSECTION 2: SERVICIO AÉREO / COURIER */}
          <div className="inter-forwarder-block reverse">
            <div className="inter-forwarder-info">
              <h3 className="inter-forwarder-subtitle">Servicio aéreo/courier</h3>
              
              <div className="inter-subservice-item">
                <p>
                  <strong>Servicio Express Courier:</strong> Nuestra plataforma nos permite ofrecer un servicio courier internacional "end to end" para envíos desde todo el mundo hasta la puerta de tu casa o sucursal Starken preferida y también para envíos desde Chile hacia el exterior. Ofrecemos una tarifa por Kilo/Volumen "end to end", "Crystal Clear", vale decir que podemos integrar toda la cadena logística.
                </p>
              </div>

              <div className="inter-subservice-item">
                <p>
                  <strong>Servicio Carga General:</strong> Ofrecemos transporte aéreo desde y hacia cualquier parte del mundo. Contamos con acuerdos con aerolíneas de cobertura internacional, trazabilidad sistemática "end to end", operador logístico y único, aduanas en origen y destino, servicio de última milla. Y que nos permiten ofrecer soluciones "integrales". Ambos servicios nos permiten ofrecer soluciones para todo tipo de envíos, ya sea paquetería, muestras, cargas paletizadas y cargas sobredimensionadas, incluyendo, última milla a través de la amplia red de Starken.
                </p>
                <p className="inter-extra-note">
                  Contamos con acuerdos de las principales aerolíneas y compañías navieras de cobertura internacional.
                </p>
              </div>

              <div className="inter-forwarder-attributes-grid">
                <div className="inter-attr-item">
                  <div className="inter-attr-icon"><Zap size={20} /></div>
                  <span className="inter-attr-text">Rapidez y agilidad</span>
                </div>
                <div className="inter-attr-item">
                  <div className="inter-attr-icon"><Eye size={20} /></div>
                  <span className="inter-attr-text">Transparencia</span>
                </div>
                <div className="inter-attr-item">
                  <div className="inter-attr-icon"><Globe size={20} /></div>
                  <span className="inter-attr-text">Operación integral</span>
                </div>
                <div className="inter-attr-item">
                  <div className="inter-attr-icon"><Tag size={20} /></div>
                  <span className="inter-attr-text">Tarifas competitivas</span>
                </div>
              </div>
            </div>

            <div className="inter-forwarder-visual-card">
              <div className="inter-photo-showcase-frame">
                <img 
                  src="/inter-air-cargo.jpg" 
                  alt="Servicio aéreo y courier internacional" 
                  className="inter-showcase-photo"
                />
                <div className="inter-showcase-caption">
                  <span className="caption-tag">Transporte Aéreo</span>
                  <h4>Carga Aérea & Courier Express</h4>
                </div>
              </div>
            </div>
          </div>

          {/* SUBSECTION 3: SERVICIO MARÍTIMO FCL/LCL */}
          <div className="inter-forwarder-block">
            <div className="inter-forwarder-info">
              <h3 className="inter-forwarder-subtitle">Servicio marítimo FCL/LCL</h3>
              
              <div className="inter-subservice-item">
                <p>
                  <strong>Servicio "End to End":</strong> USA, China. Simplificamos tu operación y ofrecemos una tarifa única end to end o puerto a puerto. Ofrecemos una tarifa por Tonelada/M3 "End to End", "Cristal Clear", vale decir que incluye: Recepción bodega origen, consolidación, aduana en origen, flete internacional, aduana en destino, desconsolidación, gastos portuarios y navieras, garantizaciones, despacho de última milla hasta la bodega de destino del cliente.
                </p>
              </div>

              <div className="inter-subservice-item">
                <p>
                  <strong>Servicio Tradicional:</strong> El resto del mundo. Si quieres mantener un stock controlado e importar en una modalidad "Just in time" y evitar el exceso de stock y costos financieros asociados, nuestro servicio LCL te permitirá embarcar tus pedidos de medianos tamaños de una manera económica y rápida. Ofrecemos tarifas competitivas, incluyendo el proceso completo hasta la última milla, si el cliente lo requiere.
                </p>
              </div>

              <div className="inter-forwarder-attributes-grid">
                <div className="inter-attr-item">
                  <div className="inter-attr-icon"><TrendingDown size={20} /></div>
                  <span className="inter-attr-text">Reducción de costos</span>
                </div>
                <div className="inter-attr-item">
                  <div className="inter-attr-icon"><Clock size={20} /></div>
                  <span className="inter-attr-text">Reducción de tiempos</span>
                </div>
                <div className="inter-attr-item">
                  <div className="inter-attr-icon"><RefreshCw size={20} /></div>
                  <span className="inter-attr-text">Reducción de intermediarios</span>
                </div>
                <div className="inter-attr-item">
                  <div className="inter-attr-icon"><ShieldCheck size={20} /></div>
                  <span className="inter-attr-text">Operador único</span>
                </div>
              </div>
            </div>

            <div className="inter-forwarder-visual-card">
              <div className="inter-photo-showcase-frame">
                <img 
                  src="/inter-sea-freight.jpg" 
                  alt="Servicio marítimo internacional FCL LCL" 
                  className="inter-showcase-photo"
                />
                <div className="inter-showcase-caption">
                  <span className="caption-tag">Transporte Marítimo</span>
                  <h4>Carga Contenedores FCL / LCL</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: ALLIANCE BANNER */}
      <section className="inter-alliance-banner-section">
        <div className="inter-alliance-banner-container">
          <div className="inter-alliance-starken-brand">
            <img 
              src="/Logo-blanco.png" 
              alt="Starken" 
              className="inter-alliance-starken-logo" 
            />
            <div className="inter-alliance-starken-sub">
              <span>internacional</span>
            </div>
          </div>

          <p className="inter-alliance-text">
            Starken Internacional nace de la unión de dos actores importantes del mundo de la logística internacional y distribución nacional: Starken (Grupo Jedimar) y Boarder Logistics (Grupo BL Corporations).
          </p>

          <div className="inter-alliance-partner-logo">
            <img 
              src="/logo-bl-corporations.png" 
              alt="BL Corporations" 
              className="inter-alliance-bl-logo" 
            />
            <span className="inter-alliance-privacy-text">
              privacy policy and terms of service.
            </span>
          </div>
        </div>
      </section>

      {/* 6. SECTION: CONTACT FORM "¿Listo para enviar al mundo? Hablemos" */}
      <section id="contacto" className="inter-contact-section">
        <div className="inter-contact-container">
          {/* Left panel: Info */}
          <div className="inter-contact-left-panel">
            <h2 className="inter-contact-title">¿Listo para enviar al mundo?</h2>
            <h3 className="inter-contact-hablemos">Hablemos</h3>

            <div className="inter-contact-channels">
              <div className="inter-channel-item">
                <div className="inter-channel-icon">
                  <Mail size={22} />
                </div>
                <div className="inter-channel-text">
                  <span className="inter-channel-label">Correo electrónico</span>
                  <a href="mailto:sales.internacional@starken.cl" className="inter-channel-value">
                    sales.internacional@starken.cl
                  </a>
                </div>
              </div>

              <div className="inter-channel-item">
                <div className="inter-channel-icon">
                  <Clock size={22} />
                </div>
                <div className="inter-channel-text">
                  <span className="inter-channel-label">Horario de atención</span>
                  <span className="inter-channel-value">Lunes a viernes 09:00–17:30 hrs.</span>
                </div>
              </div>

              <a 
                href="https://api.whatsapp.com/send?phone=56996968373" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inter-whatsapp-btn"
              >
                <MessageCircle size={20} />
                <span>Contáctanos en nuestro chat</span>
              </a>
            </div>
          </div>

          {/* Right panel: Contact Form */}
          <div className="inter-contact-right-panel">
            {formSubmitted ? (
              <div className="inter-form-success">
                <div className="inter-success-badge">
                  <Check size={36} />
                </div>
                <h3>¡Mensaje enviado con éxito!</h3>
                <p>
                  Gracias por comunicarte con nosotros. Un ejecutivo de Starken Internacional revisará tu requerimiento y te contactará a la brevedad.
                </p>
                <button 
                  type="button" 
                  className="inter-btn-primary" 
                  onClick={() => setFormSubmitted(false)}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="inter-contact-form" noValidate>
                <h3 className="inter-form-heading">Formulario de contacto</h3>

                <div className="inter-form-group">
                  <label htmlFor="nombre">
                    <span className="inter-required-asterisk">*</span> Nombre y Apellido
                  </label>
                  <input 
                    type="text" 
                    id="nombre" 
                    name="nombre" 
                    placeholder="Escribe tu nombre" 
                    value={formData.nombre}
                    onChange={handleFormChange}
                    onBlur={handleBlur}
                    className={`inter-form-control ${formErrors.nombre ? 'inter-input-error' : ''}`}
                    aria-invalid={!!formErrors.nombre}
                  />
                  {formErrors.nombre && (
                    <span className="inter-error-message">
                      {formErrors.nombre}
                    </span>
                  )}
                </div>

                <div className="inter-form-group">
                  <label htmlFor="correo">
                    <span className="inter-required-asterisk">*</span> Correo
                  </label>
                  <input 
                    type="email" 
                    id="correo" 
                    name="correo" 
                    placeholder="correo@correo.cl" 
                    value={formData.correo}
                    onChange={handleFormChange}
                    onBlur={handleBlur}
                    className={`inter-form-control ${formErrors.correo ? 'inter-input-error' : ''}`}
                    aria-invalid={!!formErrors.correo}
                  />
                  {formErrors.correo && (
                    <span className="inter-error-message">
                      {formErrors.correo}
                    </span>
                  )}
                </div>

                <div className="inter-form-group">
                  <label htmlFor="celular">
                    <span className="inter-required-asterisk">*</span> Celular
                  </label>
                  <input 
                    type="tel" 
                    id="celular" 
                    name="celular" 
                    maxLength={9}
                    placeholder="Ingresa n° de teléfono" 
                    value={formData.celular}
                    onChange={handleFormChange}
                    onBlur={handleBlur}
                    className={`inter-form-control ${formErrors.celular ? 'inter-input-error' : ''}`}
                    aria-invalid={!!formErrors.celular}
                  />
                  {formErrors.celular && (
                    <span className="inter-error-message">
                      {formErrors.celular}
                    </span>
                  )}
                </div>

                <div className="inter-form-group" ref={selectRef}>
                  <label htmlFor="asunto">
                    <span className="inter-required-asterisk">*</span> Asunto
                  </label>
                  
                  {/* Hidden select to preserve form validation and accessibility */}
                  <select 
                    id="asunto" 
                    name="asunto" 
                    value={formData.asunto}
                    onChange={handleFormChange}
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '1px', height: '1px', left: 0 }}
                  >
                    <option value="">Selecciona un asunto</option>
                    {asuntoOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>

                  {/* Custom interactive dropdown */}
                  <div className="inter-custom-select-wrapper">
                    <button
                      type="button"
                      className={`inter-form-control inter-custom-select-trigger ${isSelectOpen ? 'open' : ''} ${!formData.asunto ? 'is-placeholder' : ''} ${formErrors.asunto ? 'inter-input-error' : ''}`}
                      onClick={() => setIsSelectOpen(prev => !prev)}
                      aria-haspopup="listbox"
                      aria-expanded={isSelectOpen}
                    >
                      <span className="inter-select-display-text">
                        {asuntoOptions.find(opt => opt.value === formData.asunto)?.label || "Selecciona un asunto"}
                      </span>
                      <ChevronDown 
                        size={18} 
                        className={`inter-select-chevron ${isSelectOpen ? 'rotate' : ''}`} 
                      />
                    </button>

                    {isSelectOpen && (
                      <div className="inter-custom-select-dropdown" role="listbox">
                        {asuntoOptions.map((opt) => (
                          <div
                            key={opt.value}
                            className={`inter-custom-select-option ${formData.asunto === opt.value ? 'selected' : ''}`}
                            onClick={() => handleSelectAsunto(opt.value)}
                            role="option"
                            aria-selected={formData.asunto === opt.value}
                          >
                            <span>{opt.label}</span>
                            {formData.asunto === opt.value && <Check size={16} strokeWidth={2.5} />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {formErrors.asunto && (
                    <span className="inter-error-message">
                      {formErrors.asunto}
                    </span>
                  )}
                </div>

                <button type="submit" className="inter-form-submit-btn">
                  <span>Enviar</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Internacional;
