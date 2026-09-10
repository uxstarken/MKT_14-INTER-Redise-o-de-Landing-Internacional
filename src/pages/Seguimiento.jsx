import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Seguimiento = ({ isInsideDashboard = false, initialOf = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse query params to extract order number (OF)
  const getQueryParamOf = () => {
    if (isInsideDashboard) return initialOf;
    const params = new URLSearchParams(location.search);
    return params.get('of') || '';
  };

  const initialOfValue = getQueryParamOf();
  const [trackingInput, setTrackingInput] = useState(initialOfValue);
  const [activeOf, setActiveOf] = useState(initialOfValue);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showStatusInfoModal, setShowStatusInfoModal] = useState(false);
  const [copiedOf, setCopiedOf] = useState(false);
  const [isOfEvaluationExpanded, setIsOfEvaluationExpanded] = useState(false);
  const [showEmisorLastName, setShowEmisorLastName] = useState(false);
  const [showDestinatarioLastName, setShowDestinatarioLastName] = useState(false);
  const [showDownloadNotification, setShowDownloadNotification] = useState(false);
  const [paymentsPaid, setPaymentsPaid] = useState({});
  const [isRedirectingToPayment, setIsRedirectingToPayment] = useState(false);

  const handleCopyOf = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedOf(true);
    setTimeout(() => setCopiedOf(false), 2000);
  };

  const handlePayment = (ofNumber) => {
    setIsRedirectingToPayment(true);
    setTimeout(() => {
      setIsRedirectingToPayment(false);
      setPaymentsPaid(prev => ({ ...prev, [ofNumber]: true }));
    }, 2000);
  };

  useEffect(() => {
    if (isInsideDashboard) {
      setTrackingInput(initialOf);
      setActiveOf(initialOf);
    }
  }, [initialOf, isInsideDashboard]);

  // Synchronize state when query parameter changes
  useEffect(() => {
    const ofParam = getQueryParamOf();
    setTrackingInput(ofParam);
    setActiveOf(ofParam);
  }, [location.search]);



  // Determine user segment styles
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole') || 'Persona Natural';
  
  let themeClass = '';
  if (isLoggedIn) {
    if (userRole === 'Somos Partner') themeClass = 'theme-partner';
    else if (userRole === 'Empresas') themeClass = 'theme-empresas';
  }

  // Open Boleta download notification if redirected from login page with openBoleta flag
  useEffect(() => {
    if (location.state?.openBoleta && isLoggedIn) {
      triggerDownloadNotification();
      // Clean location state to avoid reopen on reload
      window.history.replaceState({}, document.title);
    }
  }, [location.state, isLoggedIn]);

  useEffect(() => {
    if (showDownloadNotification) {
      const timer = setTimeout(() => {
        setShowDownloadNotification(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showDownloadNotification]);

  const triggerDownloadNotification = () => {
    setShowDownloadNotification(true);
    // Simulate real file download by targeting public file
    const link = document.createElement('a');
    link.href = '/comprobante-of.pdf';
    link.download = `boleta-${activeOf || 'envio'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderNameWithToggle = (firstName, lastName, showState, setShowState) => {
    if (isLoggedIn) {
      return (
        <span className="font-semibold text-[#303030]">
          {firstName} {lastName}
        </span>
      );
    } else {
      const masked = lastName[0] + '•'.repeat(lastName.length - 1);
      return (
        <span className="font-semibold text-[#303030]">
          {firstName} {masked}
        </span>
      );
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (trackingInput.trim()) {
      setActiveOf(trackingInput.trim());
      if (!isInsideDashboard) {
        navigate(`/seguimiento?of=${trackingInput.trim()}`);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Helper to format dates dynamically (eg: "Miércoles, 19 de Agosto de 2026")
  const getFormattedDate = (daysAgo = 0) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${weekdays[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  // Mock tracking database lookup
  const getTrackingData = (ofNumber) => {
    if (!ofNumber) return null;
    
    const prefix = ofNumber.substring(0, 3);
    const isPaid = paymentsPaid[ofNumber] || false;

    // Prefixes: 111, 222, 333, 444, 555
    if (prefix === '111') {
      return {
        ofNumber: ofNumber,
        status: 'creado',
        statusMessage: 'Solicitud de envío creada',
        destination: 'PUERTO VARAS',
        deliveryInfo: 'Solicitud de envío ingresada digitalmente por remitente.',
        deliveryAddress: 'Pasaje Las Rosas 425 Pobl Corvi . - Puerto Varas',
        origin: 'Santiago',
        destinationCommune: 'Puerto Varas',
        paymentType: 'Online',
        paymentStatus: isPaid ? 'Pagado' : 'Por pagar',
        emisor: { firstName: 'Iván', lastName: 'González' },
        destinatario: { firstName: 'María', lastName: 'Gómez' },
        activeStep: 0,
        timeline: [
          {
            date: getFormattedDate(0),
            events: [
              { time: '08:30', description: 'Solicitud de envío creada' }
            ]
          }
        ],
        evidence: null
      };
    }

    if (prefix === '222') {
      return {
        ofNumber: ofNumber,
        status: 'en_reparto',
        statusMessage: 'El envío se encuentra en reparto',
        destination: 'PUERTO VARAS',
        deliveryInfo: 'En ruta de entrega a domicilio.',
        deliveryAddress: 'Pasaje Las Rosas 425 Pobl Corvi . - Puerto Varas',
        origin: 'Santiago',
        destinationCommune: 'Puerto Varas',
        paymentType: 'Online',
        paymentStatus: isPaid ? 'Pagado' : 'Por pagar',
        emisor: { firstName: 'Iván', lastName: 'González' },
        destinatario: { firstName: 'María', lastName: 'Gómez' },
        activeStep: 4,
        timeline: [
          {
            date: getFormattedDate(0),
            events: [
              { time: '08:54', description: 'En reparto a domicilio' }
            ]
          },
          {
            date: getFormattedDate(1),
            events: [
              { time: '12:48', description: 'Recibido en sucursal de destino Puerto Varas' }
            ]
          },
          {
            date: getFormattedDate(2),
            events: [
              { time: '16:32', description: 'Recibido por Starken en Centro de Distribución' },
              { time: '12:29', description: 'Solicitud de envío creada' }
            ]
          }
        ],
        evidence: null
      };
    }

    if (prefix === '333') {
      return {
        ofNumber: ofNumber,
        status: 'entregado',
        statusMessage: 'El envío ya fue entregado',
        destination: 'PUERTO VARAS',
        deliveryInfo: `Entregado con fecha ${getFormattedDate(0)} 13:10:48.`,
        deliveryAddress: 'Pasaje Las Rosas 425 Pobl Corvi . - Puerto Varas',
        origin: 'Santiago',
        destinationCommune: 'Puerto Varas',
        paymentType: 'Cta cte',
        paymentStatus: 'Pagado',
        emisor: { firstName: 'Iván', lastName: 'González' },
        destinatario: { firstName: 'María', lastName: 'Gómez' },
        activeStep: 5,
        timeline: [
          {
            date: getFormattedDate(0),
            events: [
              { time: '13:10', description: 'Entregado a destinatario' },
              { time: '08:54', description: 'En reparto a domicilio' }
            ]
          },
          {
            date: getFormattedDate(1),
            events: [
              { time: '12:48', description: 'Recibido en sucursal de destino Puerto Varas' }
            ]
          },
          {
            date: getFormattedDate(2),
            events: [
              { time: '16:32', description: 'Recibido por Starken en Centro de Distribución' },
              { time: '12:29', description: 'Solicitud de envío creada' }
            ]
          }
        ],
        evidence: {
          recipientName: 'MARIA GOMEZ SOTO',
          rut: '15.672.481-K',
          signatureUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="60" viewBox="0 0 150 60"><path d="M 10 30 Q 30 10 50 40 T 90 20 T 130 50" fill="none" stroke="%23411C72" stroke-width="3" stroke-linecap="round"/></svg>',
          date: `${getFormattedDate(0)} 13:10:48`,
          photoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=300&auto=format&fit=crop'
        }
      };
    }

    if (prefix === '444') {
      return {
        ofNumber: ofNumber,
        status: 'creado',
        statusMessage: 'Solicitud de envío creada',
        destination: 'PROVIDENCIA',
        deliveryInfo: 'Solicitud de envío creada. Despacho a Sucursal Starken.',
        deliveryAddress: 'Sucursal Starken Providencia Centro - Av. Manuel Montt 124',
        origin: 'Santiago',
        destinationCommune: 'Providencia',
        paymentType: 'Online',
        paymentStatus: isPaid ? 'Pagado' : 'Por pagar',
        emisor: { firstName: 'Iván', lastName: 'González' },
        destinatario: { firstName: 'María', lastName: 'Gómez' },
        activeStep: 0,
        isSucursalDelivery: true,
        timeline: [
          {
            date: getFormattedDate(0),
            events: [
              { time: '08:30', description: 'Solicitud de envío creada' }
            ]
          }
        ],
        evidence: null
      };
    }

    if (prefix === '555') {
      return {
        ofNumber: ofNumber,
        status: 'en_sucursal',
        statusMessage: '¡Listo para retirar!',
        destination: 'PROVIDENCIA',
        deliveryInfo: 'Disponible para retiro en sucursal Providencia Centro.',
        deliveryAddress: 'Sucursal Starken Providencia Centro - Av. Manuel Montt 124',
        origin: 'Santiago',
        destinationCommune: 'Providencia',
        paymentType: 'Online',
        paymentStatus: isPaid ? 'Pagado' : 'Por pagar',
        emisor: { firstName: 'Iván', lastName: 'González' },
        destinatario: { firstName: 'María', lastName: 'Gómez' },
        activeStep: 3,
        isSucursalDelivery: true,
        timeline: [
          {
            date: getFormattedDate(0),
            events: [
              { time: '11:15', description: 'Recibido en sucursal de destino Providencia Centro' }
            ]
          },
          {
            date: getFormattedDate(1),
            events: [
              { time: '14:20', description: 'En tránsito hacia sucursal de destino' }
            ]
          },
          {
            date: getFormattedDate(2),
            events: [
              { time: '09:00', description: 'Recibido por Starken' },
              { time: '08:30', description: 'Solicitud de envío creada' }
            ]
          }
        ],
        evidence: null
      };
    }
    
    // Exact screenshot data for number 222583926
    if (ofNumber === '222583926') {
      return {
        ofNumber: '222583926',
        status: 'entregado',
        statusMessage: 'El envío ya fue entregado',
        destination: 'PUERTO VARAS',
        deliveryInfo: 'Entregado con fecha 12-02-2024 13:10:48.',
        deliveryAddress: 'Pasaje Las Rosas 425 Pobl Corvi . - Puerto Varas',
        origin: 'Santiago',
        destinationCommune: 'Puerto Varas',
        paymentType: 'Cta cte',
        paymentStatus: 'Pagado',
        emisor: { firstName: 'Iván', lastName: 'González' },
        destinatario: { firstName: 'María', lastName: 'Gómez' },
        activeStep: 5, // 0-indexed, meaning step 6 (Entregado) is complete
        timeline: [
          {
            date: 'Lunes, 12 de Febrero de 2024',
            events: [
              { time: '13:10', description: 'Entregado a destinatario' },
              { time: '08:54', description: 'En reparto a domicilio' }
            ]
          },
          {
            date: 'Viernes, 9 de Febrero de 2024',
            events: [
              { time: '12:48', description: 'Recibido en sucursal de destino Puerto Varas' }
            ]
          },
          {
            date: 'Jueves, 8 de Febrero de 2024',
            events: [
              { time: '16:32', description: 'Recibido por Starken en Centro de Distribución' },
              { time: '12:29', description: 'Solicitud de envío creada' }
            ]
          }
        ],
        evidence: {
          recipientName: 'MARIA GOMEZ SOTO',
          rut: '15.672.481-K',
          signatureUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="60" viewBox="0 0 150 60"><path d="M 10 30 Q 30 10 50 40 T 90 20 T 130 50" fill="none" stroke="%23411C72" stroke-width="3" stroke-linecap="round"/></svg>',
          date: '12-02-2024 13:10:48',
          photoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=300&auto=format&fit=crop'
        }
      };
    }

    // Default mock data for any other number
    return {
      ofNumber: ofNumber,
      status: 'en_transito',
      statusMessage: 'El envío se encuentra en tránsito',
      destination: 'CONCEPCION',
      deliveryInfo: 'En viaje hacia Sucursal Concepción Centro.',
      deliveryAddress: 'Av. O\'Higgins 842 Dpto 402 - Concepción',
      origin: 'Santiago',
      destinationCommune: 'Concepción',
      paymentType: 'Efectivo/Online',
      paymentStatus: 'Pagado',
      emisor: { firstName: 'Iván', lastName: 'González' },
      destinatario: { firstName: 'María', lastName: 'Gómez' },
      activeStep: 2, // 3rd step: En tránsito
      timeline: [
        {
          date: getFormattedDate(0),
          events: [
            { time: '09:30', description: 'En tránsito hacia el centro de distribución Concepción' }
          ]
        },
        {
          date: getFormattedDate(1),
          events: [
            { time: '10:42', description: 'Recibido por Starken en Sucursal Providencia' },
            { time: '08:30', description: 'Solicitud de envío creada' }
          ]
        }
      ],
      evidence: null
    };
  };

  const trackingData = getTrackingData(activeOf);

  // Stepper steps configuration
  const steps = trackingData?.isSucursalDelivery ? [
    { label: 'Solicitud de Envío Creado', icon: 'create' },
    { label: 'Recibido por Starken', icon: 'received' },
    { label: 'En tránsito', icon: 'transit' },
    { label: 'En sucursal destino', icon: 'shop', sublabel: 'listo para retirar' },
    { label: 'Entregado', icon: 'delivered' }
  ] : [
    { label: 'Solicitud de Envío Creado', icon: 'create' },
    { label: 'Recibido por Starken', icon: 'received' },
    { label: 'En tránsito', icon: 'transit' },
    { label: 'En sucursal destino', icon: 'shop' },
    { label: 'En reparto', icon: 'delivery' },
    { label: 'Entregado', icon: 'delivered' }
  ];

  // Helper to render stepper SVG icons
  const renderStepIcon = (iconName) => {
    switch (iconName) {
      case 'create':
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        );
      case 'received':
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case 'transit':
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
        );
      case 'shop':
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        );
      case 'delivery':
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="10" r="3"></circle>
            <path d="M12 21a24 24 0 0 0 7-13H5a24 24 0 0 0 7 13z"></path>
          </svg>
        );
      case 'delivered':
        return (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        );
      default:
        return null;
    }
  };

  // Helper to return dynamic modal content based on active step of flete status
  const getStatusModalContent = (activeStep) => {
    switch (activeStep) {
      case 0:
        return {
          title: 'Solicitud Creada',
          subheading: 'Solicitud de Envío Registrada',
          description: 'La solicitud de envío ha sido creada de manera digital por el remitente. La orden de flete se encuentra registrada en nuestro sistema y estamos a la espera de recibir el paquete físico en Starken.',
          actionTitle: '¿Qué significa esto?',
          actionDescription: 'Significa que la etiqueta de transporte ya está generada. El seguimiento comenzará a registrar movimientos físicos reales tan pronto como el remitente entregue el paquete en una de nuestras sucursales o sea recolectado.',
          icon: (
            <svg viewBox="0 0 24 24" width="44" height="44" stroke="currentColor" strokeWidth="1.8" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          )
        };
      case 1:
        return {
          title: 'Recibido por Starken',
          subheading: 'Ingreso a Red Starken',
          description: 'El envío ha sido recibido físicamente en la sucursal de origen de Starken. El paquete ya fue pesado, medido, etiquetado e ingresado de forma conforme a nuestra red de distribución.',
          actionTitle: 'Siguientes Pasos',
          actionDescription: 'Tu paquete será consolidado junto a otros envíos y despachado en el próximo transporte de ruta disponible hacia el centro regional de distribución correspondiente.',
          icon: (
            <svg viewBox="0 0 24 24" width="44" height="44" stroke="currentColor" strokeWidth="1.8" fill="none">
              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
              <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
            </svg>
          )
        };
      case 2:
        return {
          title: 'En tránsito',
          subheading: 'Envío en Ruta de Transporte',
          description: 'Tu envío se encuentra viajando en ruta hacia la ciudad o comuna de destino. Está siendo transportado de forma segura dentro de uno de nuestros camiones de carga interurbanos.',
          actionTitle: '¿Cuándo llegará?',
          actionDescription: 'Puedes revisar la fecha estimada de entrega que aparece en la tarjeta de "Datos de tu orden de flete". El estado se actualizará tan pronto como arribe al centro de distribución local en destino.',
          icon: (
            <svg viewBox="0 0 24 24" width="44" height="44" stroke="currentColor" strokeWidth="1.8" fill="none">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          )
        };
      case 3:
        return {
          title: 'En sucursal destino',
          subheading: 'Disponible para Entrega',
          description: 'El envío ya llegó a la sucursal de destino de Starken o centro de distribución local. Si tu despacho es con retiro en agencia, ya se encuentra listo para ser retirado por el destinatario.',
          actionTitle: 'Retiro en Sucursal',
          actionDescription: 'Para retirar tu paquete, acércate a la sucursal indicada portando tu cédula de identidad y el número de orden de flete (OF). Si es con entrega a domicilio, se asignará a reparto próximamente.',
          icon: (
            <svg viewBox="0 0 24 24" width="44" height="44" stroke="currentColor" strokeWidth="1.8" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          )
        };
      case 4:
        return {
          title: 'En reparto',
          subheading: 'En Ruta de Entrega Domiciliaria',
          description: 'El paquete fue cargado en el vehículo de reparto urbano de Starken y se encuentra en ruta para ser entregado en la dirección de domicilio registrada.',
          actionTitle: 'Información del Reparto',
          actionDescription: 'Las entregas se efectúan en horario abierto durante el día. Por favor, asegúrate de que se encuentre un adulto en el domicilio para recibir y firmar la entrega del paquete.',
          icon: (
            <svg viewBox="0 0 24 24" width="44" height="44" stroke="currentColor" strokeWidth="1.8" fill="none">
              <circle cx="12" cy="10" r="3"></circle>
              <path d="M12 21a24 24 0 0 0 7-13H5a24 24 0 0 0 7 13z"></path>
            </svg>
          )
        };
      case 5:
      default:
        return {
          title: 'Entregado',
          subheading: 'Envío Entregado Exitosamente',
          description: 'El envío fue entregado al destinatario en su domicilio o ha sido retirado de manera conforme en la sucursal Starken de destino.',
          actionTitle: 'No he recibido mi envío',
          actionDescription: 'Si tu envío figura como entregado pero no lo tienes en tu poder, consulta con familiares, vecinos o conserjes de tu edificio. Si no logras ubicarlo, contáctanos a la brevedad para asistirte.',
          icon: (
            <svg viewBox="0 0 24 24" width="44" height="44" stroke="currentColor" strokeWidth="1.8" fill="none">
              <circle cx="12" cy="7" r="4"></circle>
              <path d="M5.5 21v-2a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4v2"></path>
              <rect x="9" y="16" width="6" height="5" rx="1"></rect>
            </svg>
          )
        };
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Enlace de seguimiento copiado al portapapeles.');
  };

  const formatDeliveryInfo = (info) => {
    if (!info) return '';
    const target = 'Sucursal Concepción Centro';
    if (info.includes(target)) {
      const parts = info.split(target);
      return (
        <>
          {parts[0]}
          <strong>{target}</strong>
          {parts[1]}
        </>
      );
    }
    return info;
  };

  return (
    <div 
      className={`seguimiento-wrapper ${themeClass} bg-[#fafafa] flex-1 pb-8 md:pb-10 font-nunito text-[#2b2e2c] w-full flex flex-col`} 
      style={isInsideDashboard ? { minHeight: 'auto', background: 'transparent', padding: '0 0 40px 0' } : undefined}
    >
      <div 
        className="max-w-[1200px] w-full mx-auto px-5 pt-5 pb-5 md:pt-10 md:pb-6 flex flex-col gap-6 box-border" 
        style={isInsideDashboard ? { padding: '20px 0', maxWidth: '100%' } : undefined}
      >
        {/* Top Area: Grid in desktop (2 columns if trackingData exists), 1 column in mobile */}
        <div className={`grid grid-cols-1 ${trackingData ? 'md:grid-cols-2' : ''} gap-6 w-full items-stretch`}>
          {/* Search Header area */}
          <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-black/[0.05] w-full box-border flex flex-col justify-between gap-4 order-1 md:order-2">
            <div className="flex flex-col gap-4">
              <label className="font-din text-lg font-semibold text-[#303030] mb-0.5">Realiza seguimiento en línea</label>
              <div className="flex items-center bg-[#f5f5f5] h-12 rounded-full pl-6 pr-4 w-full border border-transparent transition-all duration-300 box-border focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary-light">
                <input 
                  type="text" 
                  placeholder="Ingresa tu número de orden de flete (OF)" 
                  className="flex-1 bg-transparent border-none outline-none font-nunito text-[15px] text-[#414745] h-full placeholder:text-[#999999] placeholder:font-medium"
                  value={trackingInput}
                  maxLength={12}
                  onChange={(e) => setTrackingInput(e.target.value.replace(/[^0-9]/g, ''))}
                  onKeyDown={handleKeyPress}
                />
                <div className="flex items-center gap-4">
                  {trackingInput.length > 0 && (
                    <button 
                      className="bg-none border-none cursor-pointer flex items-center justify-center p-0 transition-transform duration-200 hover:scale-110" 
                      onClick={() => setTrackingInput('')}
                      aria-label="Borrar"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 stroke-[#999999]">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                  <button 
                    className="bg-none border-none cursor-pointer flex items-center justify-center p-0 transition-transform duration-200 hover:scale-110" 
                    onClick={handleSearch}
                    aria-label="Buscar"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 stroke-primary">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-[13px] text-[#555555]">
              <span>¿No sabes cuál es el número de orden de flete?</span>
              <button 
                className="bg-transparent border-none p-0 cursor-pointer flex items-center justify-center transition-transform duration-200 hover:scale-115" 
                onClick={() => setShowTooltip(true)}
                title="Ver dónde encontrar mi número de envío"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#FF8400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Top Right Column: Unified Status details card */}
          {trackingData && (
            <div className="bg-primary-light border border-primary/20 p-4 md:p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] w-full flex-1 flex flex-col justify-center items-center text-center gap-2.5 md:gap-4 order-2 md:order-1">
              
              {/* Top Slot: Status Message with Info Button (Large & Bold) */}
              <h2 className="font-din text-xl md:text-2xl font-bold text-primary text-center flex items-center justify-center gap-2">
                {(() => {
                  const words = (trackingData.statusMessage || '').split(' ');
                  const lastWord = words.pop() || '';
                  const mainText = words.join(' ');
                  return (
                    <>
                      <span>{mainText} {lastWord}</span>
                      <button 
                        onClick={() => setShowStatusInfoModal(true)}
                        className="bg-transparent border-none p-0 cursor-pointer inline-flex items-center justify-center transition-transform duration-200 hover:scale-115 align-middle"
                        title="Ver detalle del estado"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="#FF8400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                      </button>
                    </>
                  );
                })()}
              </h2>

              {/* Symmetrical divider */}
              <div className="w-full border-b border-primary/10 my-0.5"></div>

              {/* Middle Slot: Freight Order Number with Copy Button (Small & Uppercase) */}
              <div className="flex flex-col items-center justify-center w-full">
                <div className="flex items-center justify-center gap-2 text-primary font-bold text-[13px] sm:text-[14px] tracking-wider uppercase mb-1 md:mb-2">
                  <span>Número Orden de Flete Nº {trackingData.ofNumber}</span>
                  <button 
                    onClick={() => handleCopyOf(trackingData.ofNumber)}
                    className="bg-transparent border-none p-1 text-primary hover:text-primary-hover flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-90"
                    title="Copiar número de flete"
                  >
                    {copiedOf ? (
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary animate-[fadeIn_0.2s_ease-out]">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Secondary details in readable charcoal/gray over light green */}
                <p className="text-[15px] text-[#414745] font-semibold mb-1">
                  Envío a <strong className="text-primary font-bold">{trackingData.destination}</strong>
                </p>
                <p className="text-[13px] text-[#555a58] m-0 font-medium">
                  {formatDeliveryInfo(trackingData.deliveryInfo)}
                </p>
              </div>

            </div>
          )}
        </div>

        {/* Status Info Modal */}
        {showStatusInfoModal && trackingData && (() => {
          const modalContent = getStatusModalContent(trackingData.activeStep);
          return (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[10000] flex items-center justify-center animate-[fadeIn_0.2s_ease-out]" onClick={() => setShowStatusInfoModal(false)}>
              <div className="bg-white w-[95%] max-w-[420px] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] overflow-hidden relative border border-black/5 animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)]" onClick={(e) => e.stopPropagation()}>
                
                {/* Header Title bar */}
                <div className="pt-5 pb-3 px-6 bg-white flex justify-between items-center">
                  <h3 className="m-0 font-din text-[15px] font-bold text-[#303030]">Información del Estado</h3>
                  <button className="bg-transparent border-none text-primary hover:text-primary-hover text-xl font-bold cursor-pointer transition-transform duration-200 hover:scale-115 flex items-center justify-center" onClick={() => setShowStatusInfoModal(false)}>
                    ×
                  </button>
                </div>
                {/* Padded Horizontal Separator */}
                <div className="mx-6 border-b border-[#f0f0f0]"></div>

                {/* Modal Body */}
                <div className="p-6 flex flex-col items-center gap-5">
                  {/* Large Green Circle Icon */}
                  <div className="bg-[#029E47]/10 text-primary w-20 h-20 rounded-full flex items-center justify-center border border-primary/15">
                    {modalContent.icon}
                  </div>

                  <div className="text-center w-full">
                    <h4 className="font-din text-base font-bold text-[#303030] m-0 mb-1.5">{modalContent.title}</h4>
                    <p className="text-[13px] leading-[1.5] text-[#555555] m-0 text-center">{modalContent.description}</p>
                  </div>

                  {/* Premium Alert/Accent Card Section */}
                  <div className="bg-[#029E47]/5 border-l-4 border-primary rounded-r-lg p-4 w-full text-left">
                    <h5 className="font-din text-[13px] font-bold text-primary m-0 mb-1">{modalContent.subheading}</h5>
                    <p className="text-[12.5px] leading-[1.4] text-[#555555] m-0">{modalContent.actionDescription}</p>
                  </div>

                  {/* Buttons Stack / Row */}
                  <div className="flex gap-3 w-full justify-center mt-2.5">
                    {/* WhatsApp Support Button */}
                    <a 
                      href="https://wa.me/569XXXXXXXX" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 bg-transparent text-primary border border-primary py-2.5 px-5 rounded-full text-[13px] font-semibold transition-all duration-200 hover:bg-primary/5 text-center decoration-none flex items-center justify-center cursor-pointer"
                    >
                      WhatsApp
                    </a>

                    {/* Cerrar Button */}
                    <button 
                      className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 px-5 rounded-full text-[13px] font-semibold transition-colors duration-200 text-center border-none cursor-pointer"
                      onClick={() => setShowStatusInfoModal(false)}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

          {/* OF Help Modal */}
          {showTooltip && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[10000] flex items-center justify-center animate-[fadeIn_0.2s_ease-out]" onClick={() => setShowTooltip(false)}>
              <div className="bg-white w-[95%] max-w-[420px] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] overflow-hidden relative border border-black/5 animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)]" onClick={(e) => e.stopPropagation()}>
                
                {/* Header Title bar */}
                <div className="pt-5 pb-3 px-6 bg-white flex justify-between items-center">
                  <h3 className="m-0 font-din text-[15px] font-bold text-[#303030]">¿Dónde encuentro mi número de orden?</h3>
                  <button className="bg-transparent border-none text-primary hover:text-primary-hover text-xl font-bold cursor-pointer transition-transform duration-200 hover:scale-115 flex items-center justify-center" onClick={() => setShowTooltip(false)}>
                    ×
                  </button>
                </div>
                {/* Padded Horizontal Separator */}
                <div className="mx-6 border-b border-[#f0f0f0]"></div>

                {/* Modal Body */}
                <div className="p-6 flex flex-col items-center gap-5">
                  {/* Indicative Image */}
                  <img 
                    src="/comprobante-of.png" 
                    alt="Ubicación de Orden de Flete en el Comprobante" 
                    className="w-full rounded-lg object-cover border border-[#e5e7eb] aspect-[4/3] shadow-[0_2px_8px_rgba(0,0,0,0.04)]" 
                  />

                  <div className="text-center w-full">
                    <p className="text-[13px] leading-[1.5] text-[#555555] m-0 text-center">
                      La Orden de Flete (OF) es un <strong>código único para cada envío</strong> que está compuesto por <strong>9 a 12 dígitos</strong>. Este número puedes encontrarlo en la parte de descripción del comprobante que te damos cuando envías algo con nosotros y por eso es importante que no lo pierdas.
                    </p>
                  </div>

                  {/* Action button */}
                  <div className="flex w-full justify-center mt-1">
                    <button 
                      className="bg-transparent text-primary border border-primary py-2.5 px-6 rounded-full text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:bg-primary/5 w-[240px] text-center"
                      onClick={() => alert('¡Próximamente: Recuperar Orden de Flete!')}
                    >
                      Recuperar mi Orden de Flete
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        {/* Tracking Results */}
        {trackingData ? (
          <div className="flex flex-col gap-6 w-full animate-[fadeIn_0.3s_ease-out]">
            {/* Combined Stepper & detailed timeline card */}
            <div className="bg-white pt-6 px-6 pb-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-black/[0.05] w-full box-border relative flex flex-col gap-6">
              {/* Card Header Title */}
              <h3 className="font-din text-[15px] font-bold text-[#303030] m-0 border-b-[1.5px] border-[#f3f4f6] pb-3">Seguimiento</h3>

              {/* Stepper container */}
              <div className="relative w-full pt-1.5 pb-2">
                <div className="absolute top-[24px] left-[8%] right-[8%] h-0.5 bg-[#eaeaea] z-10 hidden md:block">
                  <div 
                    className="h-full bg-primary transition-[width] duration-400 ease" 
                    style={{ width: `${(trackingData.activeStep / (steps.length - 1)) * 100}%` }}
                  />
                </div>
                
                <div className="flex flex-col-reverse md:flex-row md:justify-between gap-[28px] md:gap-0 relative z-20">
                  {steps.map((step, idx) => {
                    const isSuperado = idx < trackingData.activeStep;
                    const isActive = idx === trackingData.activeStep;
                    const isCompletedOrActive = idx <= trackingData.activeStep;
                    
                    return (
                      <div key={idx} className="w-full md:w-[14%] flex flex-row md:flex-col items-center text-left md:text-center gap-4 md:gap-2.5 relative">
                        {idx > 0 && (
                          <div className={`absolute left-[4px] md:left-[18px] top-[10px] md:top-[18px] h-[36px] md:h-[56px] w-[2px] md:hidden ${
                            idx <= trackingData.activeStep ? 'bg-primary' : 'bg-[#eaeaea]'
                          }`} />
                        )}
                        <div className="flex justify-start md:justify-center items-center relative z-10">
                          <div className={`w-2.5 h-2.5 md:w-9 md:h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            isSuperado 
                              ? 'bg-primary border-primary text-white' 
                              : isActive 
                                ? 'bg-white border-[#FF8400] text-[#FF8400] md:shadow-[0_0_0_4px_rgba(255,132,0,0.15)] shadow-[0_0_0_3px_rgba(255,132,0,0.15)] md:scale-105' 
                                : 'bg-white border-[#d1d5db] text-[#9ca3af]'
                          }`}>
                            {isSuperado ? (
                              <div className="hidden md:flex items-center justify-center">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                            ) : (
                              <div className="hidden md:flex items-center justify-center">
                                {renderStepIcon(step.icon)}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className={`text-xs leading-[1.3] transition-colors duration-300 relative z-10 flex flex-col ${
                          isCompletedOrActive 
                            ? 'text-[#303030] font-semibold' 
                            : 'text-[#6b7280] font-medium'
                        }`}>
                          <span>{step.label}</span>
                          {step.sublabel && (
                            <span className={`text-[10px] font-bold mt-0.5 md:text-center text-left ${
                              isCompletedOrActive ? 'text-[#029E47]' : 'text-[#9ca3af]'
                            }`}>
                              {step.sublabel}
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Collapsible Detailed Timeline section wrapper */}
              <div className="flex flex-col">
                {/* Accordion header with Detalle de seguimiento and Compartir seguimiento */}
                <div className={`border-t border-[#f0f0f0] pt-4 flex flex-row justify-between items-center transition-all duration-300 ${isTimelineExpanded ? 'pb-4' : 'pb-0'}`}>
                  <button 
                    className="bg-transparent border-none py-2 flex items-center justify-center gap-1.5 font-nunito text-[11.5px] sm:text-[13px] font-semibold text-primary hover:text-primary-hover cursor-pointer transition-colors duration-200"
                    onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
                  >
                    <svg 
                      className={`transition-transform duration-300 ${isTimelineExpanded ? 'rotate-180' : ''} text-primary`}
                      viewBox="0 0 24 24" 
                      width="18" 
                      height="18" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      fill="none"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                    <span>Detalle del seguimiento</span>
                  </button>

                  <button 
                    className="bg-none border-none text-primary hover:text-primary-hover text-[11.5px] sm:text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-colors duration-200" 
                    onClick={copyToClipboard}
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      width="16" 
                      height="16" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      fill="none" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    Compartir seguimiento
                  </button>
                </div>

                {/* Collapsible events list container */}
                <div className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${isTimelineExpanded ? 'max-h-[320px] opacity-100 translate-y-0 border-t border-[#f0f0f0] pt-4' : 'max-h-0 opacity-0 -translate-y-2'}`}>
                  <div className="relative pl-3">
                    <div className="flex flex-col gap-6 relative">
                      <div className="absolute top-[38px] bottom-[10px] left-[16px] w-0.5 bg-[#eaeaea]"></div>
                    {trackingData.timeline.map((day, dIdx) => (
                      <div key={dIdx} className="flex flex-col gap-3 relative z-10">
                        <p className="text-[13px] font-bold text-[#303030] m-0 pl-[48px]">{day.date}</p>
                        
                        <div className="flex flex-col gap-3">
                          {day.events.map((evt, eIdx) => (
                            <div key={eIdx} className="flex items-center text-[13px] text-[#555555]">
                              <div className="w-8 flex justify-center">
                                <div className={`w-2 h-2 rounded-full border-2 border-white transition-all ${
                                  dIdx === 0 && eIdx === 0 
                                    ? 'bg-primary shadow-[0_0_0_3px_var(--primary-light)]' 
                                    : 'bg-[#cbd5e1] shadow-[0_0_0_2px_#e2e8f0]'
                                }`}></div>
                              </div>
                              <div className="w-[45px] font-semibold text-[#303030] ml-4">{evt.time}</div>
                              <div className="mx-2.5 text-[#eaeaea]">|</div>
                              <div className="flex-1 font-medium">{evt.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Flete Card Info & Actions combined */}
            <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-black/[0.05] w-full box-border flex flex-col gap-5">
              <div className="flex justify-between items-center border-b-[1.5px] border-[#f3f4f6] pb-3">
                <h3 className="font-din text-[15px] font-bold text-[#303030] m-0">Datos de tu orden de flete</h3>
                {trackingData.paymentStatus === 'Pagado' && (
                  <button 
                    onClick={() => {
                      if (isLoggedIn) {
                        triggerDownloadNotification();
                      } else {
                        navigate('/login', { state: { from: location.pathname + location.search } });
                      }
                    }}
                    className="bg-transparent border-none flex items-center gap-1.5 text-primary hover:text-primary-hover font-semibold text-[13px] cursor-pointer transition-colors duration-200"
                    title="Descargar comprobante de envío"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>Descargar Boleta</span>
                  </button>
                )}
              </div>
              {/* Details grid taking the full layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-12">
                <div className="flex flex-col gap-3.5">
                  <div className="flex items-start text-[13px] leading-[1.4] gap-2">
                    <span className="text-[#777777] font-medium w-[100px] shrink-0">Destino</span>
                    <span className="text-[#303030] font-semibold text-left">{trackingData.deliveryAddress}</span>
                  </div>
                  <div className="flex items-start text-[13px] leading-[1.4] gap-2">
                    <span className="text-[#777777] font-medium w-[100px] shrink-0">Estado de pago</span>
                    <span className={`font-bold text-left ${trackingData.paymentStatus === 'Pagado' ? 'text-[#029E47]' : 'text-[#FF8400]'}`}>{trackingData.paymentStatus}</span>
                  </div>
                  <div className="flex items-start text-[13px] leading-[1.4] gap-2">
                    <span className="text-[#777777] font-medium w-[100px] shrink-0">Remitente</span>
                    {renderNameWithToggle(trackingData.emisor.firstName, trackingData.emisor.lastName, showEmisorLastName, setShowEmisorLastName)}
                  </div>
                </div>
                
                <div className="flex flex-col gap-3.5">
                  <div className="flex items-start text-[13px] leading-[1.4] gap-2">
                    <span className="text-[#777777] font-medium w-[100px] shrink-0">Origen</span>
                    <span className="text-[#303030] font-semibold text-left">{trackingData.origin}</span>
                  </div>
                  <div className="flex items-start text-[13px] leading-[1.4] gap-2">
                    <span className="text-[#777777] font-medium w-[100px] shrink-0">Destinatario</span>
                    {renderNameWithToggle(trackingData.destinatario.firstName, trackingData.destinatario.lastName, showDestinatarioLastName, setShowDestinatarioLastName)}
                  </div>
                </div>
              </div>

              {/* Bottom Actions wrapper to match the top card padding layout */}
              <div className="flex flex-col">
                {/* Bottom Actions Footer: Horizontal Row */}
                <div className={`border-t border-[#f0f0f0] pt-4 flex flex-row justify-between items-center w-full text-[11px] sm:text-[13px] font-semibold transition-all duration-300 gap-3 ${isOfEvaluationExpanded ? 'pb-4' : 'pb-0'}`}>
                  
                  {/* Collapsible toggle for evaluation */}
                  {isLoggedIn ? (
                    <button 
                      onClick={() => setIsOfEvaluationExpanded(!isOfEvaluationExpanded)}
                      className="bg-transparent border-none py-1 flex items-start gap-1.5 cursor-pointer text-primary hover:text-primary-hover font-semibold text-left"
                    >
                      <svg 
                        viewBox="0 0 24 24" 
                        width="16" 
                        height="16" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className={`stroke-primary shrink-0 mt-0.5 transition-transform duration-300 ${isOfEvaluationExpanded ? 'rotate-180' : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                      <span className="leading-[1.2] text-left">Evalúa la información de tu OF</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {/* Ver evidencia de entrega as text link OR Pagar tu envío as orange button */}
                  {trackingData.paymentStatus === 'Por pagar' ? (
                    <button
                      onClick={() => handlePayment(trackingData.ofNumber)}
                      className="bg-[#FF8400] hover:bg-[#e07500] text-white py-2 px-5 rounded-full text-xs font-bold transition-all duration-200 shadow-md cursor-pointer ml-auto flex items-center gap-1.5 active:scale-95 border-none"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-white">
                        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                        <line x1="12" y1="18" x2="12.01" y2="18"></line>
                      </svg>
                      Pagar tu envío
                    </button>
                  ) : trackingData.status === 'entregado' ? (
                    <button 
                      onClick={() => setShowEvidenceModal(true)}
                      className="bg-transparent border-none py-1 flex items-start gap-1.5 cursor-pointer text-primary hover:text-primary-hover font-semibold text-right justify-end ml-auto"
                    >
                      <span className="leading-[1.2] text-right">Ver evidencia de entrega</span>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary shrink-0 mt-0.5">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <line x1="10" y1="9" x2="8" y2="9"></line>
                      </svg>
                    </button>
                  ) : (
                    <span className="text-[#9ca3af] py-1 flex items-start gap-1.5 cursor-not-allowed select-none font-semibold text-right justify-end ml-auto">
                      <span className="leading-[1.2] text-right">Ver evidencia de entrega</span>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-[#9ca3af] shrink-0 mt-0.5">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <line x1="10" y1="9" x2="8" y2="9"></line>
                      </svg>
                    </span>
                  )}
                </div>

                {/* Collapsible Evaluation survey box */}
                {isLoggedIn && (
                  <div className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${isOfEvaluationExpanded ? 'max-h-[200px] opacity-100 translate-y-0 border-t border-[#f0f0f0] pt-4' : 'max-h-0 opacity-0 -translate-y-2'}`}>
                    <div className="flex flex-col gap-3 items-center text-center">
                      <p className="text-[13px] font-semibold text-[#555555] m-0">¿Qué tan útil y correcta te resultó la información de tu orden de flete?</p>
                      <div className="flex gap-4 my-1">
                        {['😠', '🙁', '😐', '🙂', '😃'].map((emoji, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => {
                              alert('¡Gracias por evaluar la información de tu orden!');
                              setIsOfEvaluationExpanded(false);
                            }}
                            className="text-3xl hover:scale-125 active:scale-95 transition-all duration-200 bg-transparent border-none cursor-pointer w-12 h-12 flex items-center justify-center rounded-full hover:bg-primary/10 select-none overflow-visible leading-none"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white py-15 px-10 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-black/[0.05] w-full box-border text-center text-[#777777] text-sm flex flex-col items-center gap-3.5">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#ccc" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>Ingresa un número de orden para ver el estado de tu envío.</p>
          </div>
        )}
      </div>

      {/* Signature/Photo Evidence Modal */}
      {showEvidenceModal && trackingData.evidence && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[10000] flex items-center justify-center animate-[fadeIn_0.2s_ease-out]" onClick={() => setShowEvidenceModal(false)}>
          <div className="bg-white w-[90%] max-w-[420px] rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] overflow-hidden animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)] border border-black/5" onClick={(e) => e.stopPropagation()}>
            <div className="py-4 px-5 bg-[#f9fafb] border-b-[1.5px] border-[#f3f4f6] flex justify-between items-center">
              <h3 className="m-0 font-din text-[15px] font-bold text-[#303030]">Evidencia Digital de Entrega</h3>
              <button className="bg-none border-none text-2xl text-[#9ca3af] hover:text-[#4b5563] cursor-pointer" onClick={() => setShowEvidenceModal(false)}>×</button>
            </div>
            
            <div className="p-5 flex flex-col gap-3.5 text-[13px]">
              <div className="flex justify-between items-center">
                <span className="text-[#777777] font-medium">Recibido por:</span>
                <strong className="text-[#303030] font-semibold">{trackingData.evidence.recipientName}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#777777] font-medium">RUT:</span>
                <span className="text-[#303030] font-semibold">{trackingData.evidence.rut}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#777777] font-medium">Fecha y Hora:</span>
                <span className="text-[#303030] font-semibold">{trackingData.evidence.date}</span>
              </div>
              
              <div className="flex flex-col gap-2 mt-2.5">
                <span className="text-[#777777] font-medium">Firma Digital:</span>
                <div className="bg-[#fafafa] border border-dashed border-[#d1d5db] rounded-md h-[70px] flex items-center justify-center">
                  <img src={trackingData.evidence.signatureUrl} alt="Firma" style={{ height: '50px' }} />
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2.5">
                <span className="text-[#777777] font-medium">Fotografía de Entrega:</span>
                <img src={trackingData.evidence.photoUrl} alt="Foto del paquete entregado" className="w-full h-40 object-cover rounded-md border border-[#e5e7eb]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification for Download */}
      {showDownloadNotification && (
        <div className="fixed bottom-6 right-6 bg-[#029E47] text-white py-3.5 px-6 rounded-xl shadow-[0_10px_30px_rgba(2,158,71,0.3)] z-[10000] flex items-center gap-3 animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)] border border-[#016E31]">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="stroke-white">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span className="font-din font-bold text-[14px] tracking-wide">Documento descargado con éxito</span>
        </div>
      )}

      {/* Redirection to Payment Gateway Modal */}
      {isRedirectingToPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[20000] flex flex-col items-center justify-center animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-[340px] text-center gap-4 border border-black/5 animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary/10"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#029E47] border-t-transparent animate-spin"></div>
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
              <h4 className="font-din font-bold text-lg text-[#303030]">Procesando Pago</h4>
              <p className="text-[13px] text-[#6b7280] leading-relaxed">
                Redirigiendo a la pasarela de pago seguro. Por favor, no cierres esta ventana.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seguimiento;
