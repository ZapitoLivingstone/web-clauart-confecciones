import React from 'react';
import '../styles/WhatsappBubble.css';

const WhatsappBubble = () => {
  const whatsappNumber = "https://wa.me/56912345678"; // Reemplaza con el número de la modista

  return (
    <a
      href={whatsappNumber}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-bubble"
      aria-label="Contáctanos por WhatsApp"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        className="whatsapp-icon"
      />
    </a>
  );
};

export default WhatsappBubble;
