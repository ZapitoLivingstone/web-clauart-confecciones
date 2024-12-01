import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTiktok, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div className="mb-3 mb-md-0">
          <img
            src="icono/Icono_clauart.jpeg" 
            alt="Logo"
            className="img-fluid"
            style={{ height: '50px' }}
          />
        </div>
        <div className="d-flex gap-3">
          <a
            href="https://www.instagram.com/clauart_confecciones/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light"
          >
            <FontAwesomeIcon icon={faInstagram} size="lg" />
          </a>
          <a
            href="https://www.tiktok.com/@clauart_confecciones"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light"
          >
            <FontAwesomeIcon icon={faTiktok} size="lg" />
          </a>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light"
          >
            <FontAwesomeIcon icon={faWhatsapp} size="lg" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
