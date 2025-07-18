import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { 
  AiFillGithub,
  AiOutlineTwitter,
  AiOutlineMail
} from "react-icons/ai";
import { 
  FaLinkedinIn,
  FaRobot,
  FaGraduationCap 
} from "react-icons/fa";
import { RiRoadMapLine } from "react-icons/ri";
import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <Container>
        <Row className="footer-content">
          <Col lg={8} md={12} className="footer-brand">
            <div className="logo-container">
              <FaRobot className="footer-logo-icon" />
              <div>
                <span className="footer-brand-name">Edu GO | AI Learning Hub</span>
                <p className="footer-tagline">
                  Empowering your learning journey with AI
                </p>
              </div>
            </div>
            
            <div className="footer-features compact">
              <span className="feature-badge">
                <FaGraduationCap /> Edu GO
              </span>
              <span className="feature-badge">
                <RiRoadMapLine /> Smart Roadmaps
              </span>
            </div>
          </Col>
          
          <Col lg={4} md={12} className="footer-contact">
            <div className="linear-connect">
              <h5>Connect With Us</h5>
              <div className="social-icons">
                <a href="https://github.com/aniketofficial540" target="_blank" rel="noopener noreferrer">
                  <AiFillGithub /> GitHub
                </a>
                <a href="https://twitter.com/_aniket_adarsh" target="_blank" rel="noopener noreferrer">
                  <AiOutlineTwitter /> Twitter
                </a>
                <a href="https://www.linkedin.com/in/aniket-adarsh/" target="_blank" rel="noopener noreferrer">
                  <FaLinkedinIn /> LinkedIn
                </a>
              </div>
            </div>
          </Col>
        </Row>
        
        <Row className="footer-bottom">
          <Col md={6} className="copyright">
            © {year} Edu GO
          </Col>
          <Col md={6} className="credits">
            <span>By </span>
            <a href="https://github.com/aniketofficial540" target="_blank" rel="noopener noreferrer">
              Aniket Adarsh
            </a>
            <span>, </span>
            <a target="_blank" rel="noopener noreferrer">
              Akriti Kumari
            </a>
            <span>, </span>
            <a target="_blank" rel="noopener noreferrer">
              Subhash Sharma
            </a>
            <span>, </span>
            <a target="_blank" rel="noopener noreferrer">
              Aditya Sharma
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;