const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-left">
            <h3 className="footer-brand">Deepfake Detection Platform</h3>
            <p className="footer-description">
              Industry 5.0 compliant AI platform for deepfake detection and
              response
            </p>
          </div>

          <div className="footer-right">
            <nav className="footer-nav">
              <a href="#about" className="footer-link">
                About
              </a>
              <a href="#privacy" className="footer-link">
                Privacy
              </a>
              <a href="#contact" className="footer-link">
                Contact
              </a>
            </nav>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            Powered by MobileNetV2 & MTCNN | Industry 5.0 Compliant Platform
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
