// src/Home.jsx

import React, { useState } from 'react'; 
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import fondoImage from "../assets/img/fondo.jpg"; 
import logoImage from "../assets/img/logo.png"; // ¡AQUÍ ESTÁ EL LOGO IMPORTADO!
import "../styles/home.css"; 

// 🚨🚨🚨 URL DE GOOGLE APPS SCRIPT (Web Hook) 🚨🚨🚨
// Mantener la URL con /exec (es la versión de producción que debe tener CORS activo)
const API_URL = 'https://script.google.com/macros/s/AKfycbw2umTjRlZKCnVR-IYO1DAaNqa9GTzAVZM1AFjidgXapY0EIMNprtVwKOCvX82WagSjFA/exec';

// Enlace de Google Drive para el PDF
const GOOGLE_DRIVE_PDF_URL = "https://drive.google.com/file/d/1gqVEI7SnBNPGW0RCCQ-QbBF10n35506p/preview";
// Enlace del sitio web
const WEBSITE_URL = "https://www.pedagogicocrear.edu.co/";


// ------------------------------------------------------------------
// COMPONENTE MODAL DE INFORMACIÓN
// ------------------------------------------------------------------
const InfoModal = ({ show, onClose }) => {
// ... (El código de InfoModal se mantiene igual)
    if (!show) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3 className="modal-title">Opciones de Información</h3>
                
                <div className="modal-buttons-container">
                    {/* Botón para abrir el sitio web en una nueva pestaña */}
                    <a 
                        href={WEBSITE_URL} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="modal-button btn-web"
                        onClick={onClose} // Cierra el modal al hacer clic
                    >
                        PÁGINA WEB 🌐
                    </a>
                    
                    {/* Botón para abrir el PDF en una nueva pestaña */}
                    <a 
                        href={GOOGLE_DRIVE_PDF_URL} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="modal-button btn-pdf"
                        onClick={onClose} // Cierra el modal al hacer clic
                    >
                        INFO PDF 📄
                    </a>
                </div>

                <button className="modal-close-button" onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    );
};


export const Home = () => {
    
    // Obtiene el estado y el dispatcher del contexto global
    const { store, dispatch } = useGlobalReducer(); 
    
    // Estado para controlar la visibilidad del modal de información
    const [showInfoModal, setShowInfoModal] = useState(false);
    
    // ¡Usamos store.view directamente, ya que lo definimos en el estado global!
    const currentView = store.view; 

    const changeView = (view) => {
        // Ejecutamos la acción 'SET_VIEW', que ya está definida en el reducer
        dispatch({ type: 'SET_VIEW', payload: view });
    };

    // ------------------------------------------------------------------
    // 2. Componente (función interna) para el formulario de fotos
    // ------------------------------------------------------------------
    const PhotoFormContent = () => {
// ... (El código de PhotoFormContent se mantiene igual)
        const [formData, setFormData] = useState({
            name: '',        // Corresponde a 'Nombre Completo'
            phone: '',       // Corresponde a 'Teléfono Celular'
            email: '',       // Corresponde a 'Correo Electrónico'
            photoNumber: '', // Corresponde a 'Número de Foto'
            observations: '',// Corresponde a 'Observaciones'
        });
        
        // Estado para manejar la carga y los mensajes
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [message, setMessage] = useState('');

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            
            // 1. Inicializar estados de envío
            setIsSubmitting(true);
            setMessage('Enviando datos a la cripta...');

            try {
                // Convertir el objeto formData a URLSearchParams
                const params = new URLSearchParams();
                for (const key in formData) {
                    params.append(key, formData[key]);
                }

                await fetch(API_URL, {
                    method: 'POST',
                    mode: 'no-cors', 
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded' 
                    },
                    body: params.toString(),
                });
                
                // Si llegamos aquí sin que se lance una excepción, el envío de red fue exitoso.
                
                // ÉXITO: Mostrar mensaje y limpiar
                setMessage(`¡Éxito! Gracias, ${formData.name}. Tus datos han sido guardados.`);
                
                setFormData({
                    name: '', phone: '', email: '', photoNumber: '', observations: '',
                });
                
                // Volver al menú después de un breve tiempo para que el usuario vea la notificación
                setTimeout(() => {
                    changeView('infographic');
                    setMessage('');
                }, 2500);


            } catch (error) {
                // ERROR DE CONEXIÓN (red, URL incorrecta)
                console.error("Error de conexión:", error);
                setMessage(`☠️ Error de conexión de red. Detalles: ${error.message || 'Error desconocido.'}`);
                setTimeout(() => setMessage(''), 5000); 

            } finally {
                // Deshabilitar el estado de envío
                setIsSubmitting(false);
            }
        };

        // Estilos del mensaje
        const messageStyle = {
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 'bold',
            fontSize: '1rem',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '10px',
            marginTop: '-10px',
            backgroundColor: message.includes('Éxito') ? 'rgba(0, 255, 0, 0.1)' : message.includes('Error') || message.includes('☠️') ? 'rgba(255, 69, 0, 0.15)' : 'transparent',
            color: message.includes('Éxito') ? '#00A800' : message.includes('Error') || message.includes('☠️') ? '#8B0000' : '#4A0079',
        };

        return (
            <div className="content-box form-container">
                <h2 className="content-title form-title">Registro de Datos para Fotos 📸</h2>
                
                {/* NOTIFICACIÓN */}
                {message && <p style={messageStyle}>{message}</p>}

                <form onSubmit={handleSubmit} className="halloween-form">
                    
                    <label className="form-label">Nombre Completo:
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" disabled={isSubmitting}/>
                    </label>
                    
                    <label className="form-label">Teléfono Celular:
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="form-input" disabled={isSubmitting}/>
                    </label>

                    <label className="form-label">Correo Electrónico:
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" disabled={isSubmitting}/>
                    </label>

                    <label className="form-label">Número de Foto:
                        <input type="text" name="photoNumber" value={formData.photoNumber} onChange={handleChange} required className="form-input" disabled={isSubmitting}/>
                    </label>

                    <label className="form-label">Observaciones:
                        <textarea name="observations" value={formData.observations} onChange={handleChange} className="form-textarea" disabled={isSubmitting}/>
                    </label>

                    <button type="submit" className="form-submit-button" disabled={isSubmitting}>
                        {isSubmitting ? 'ENVIANDO...' : 'ENVIAR DATOS TENEBROSOS'}
                    </button>
                </form>

                <button 
                    className="menu-button back-button" 
                    onClick={() => changeView('infographic')}
                    disabled={isSubmitting}
                >
                    Volver al Menú
                </button>
            </div>
        );
    };

    // ------------------------------------------------------------------
    // Renderizado Principal
    // ------------------------------------------------------------------
    return (
        <div 
            className="home-container"
            style={{ 
                backgroundImage: `url(${fondoImage})` 
            }} 
        >
            {/* 👻 INICIO DE CAMBIO: ENVUELVE EL LOGO EN EL DIV logo-wrapper-desktop 👻 */}
            <div className="logo-wrapper-desktop">
                <img 
                    src={logoImage} 
                    alt="Logo Instituto Pedagógico Crear" 
                    className="site-logo"
                />
            </div>
            {/* 👻 FIN DE CAMBIO 👻 */}
            
            {/* Contenedor para centrar el título y el menú */}
            <div className="center-content-wrapper">
                
                {/* TÍTULO DE HALLOWEEN CON SPAN PARA EL EFECTO DE ARCO */}
                <h1 className="halloween-title">
                    <span>Instituto</span> <span>Pedagógico</span> <span>Crear</span>
                </h1>
                
                <div className="main-content-area">
                    
                    {/* 1. Menú (Muestra si la vista es 'infographic') */}
                    {currentView === 'infographic' && (
                        <div className="main-menu">
                            <button 
                                className="menu-button btn-info" 
                                onClick={() => setShowInfoModal(true)} // ABRIR MODAL
                            >
                                INFORMACIÓN
                            </button>
                            <button className="menu-button btn-datos" onClick={() => changeView('form')}>DATOS PARA FOTOS</button>
                        </div>
                    )}

                    {/* 2. Formulario (Muestra si la vista es 'form') */}
                    {currentView === 'form' && <PhotoFormContent />}
                </div>
            </div>
            
            {/* 3. MODAL (Siempre renderizado, pero visible por estado) */}
            <InfoModal 
                show={showInfoModal} 
                onClose={() => setShowInfoModal(false)} 
            />
        </div>
    );
};